import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { NotificationsContextProvider } from 'shared/contexts/NotificationsContext';
import { ShareMediaContextProvider } from 'shared/contexts/ShareMediaContext';
import { UserConnectionsContextProvider } from 'shared/contexts/UserConnectionsContext';
import { TokenConversionContextProvider } from 'shared/contexts/TokenConversionContext';
import { PageRefreshContextProvider } from 'shared/contexts/PageRefreshContext';
import { MessagesContextProvider } from 'shared/contexts/MessagesContext';
import { AuthContextProvider } from 'shared/contexts/AuthContext';
import NavBar from 'shared/ui-kit/Navigation/NavBar';
import URL, { LISTENER_URL } from 'shared/functions/getURL';
import IPFSURL from 'shared/functions/getIPFSBackendURL';
import { setLoginBool } from 'store/actions/LoginBool';
import { setBalances, BalanceModel } from 'store/actions/UserBalancesActions';
import { setEthExternalWallet, setUser } from 'store/actions/User';
import { RootState, useTypedSelector } from 'store/reducers/Reducer';
import {
  getTokenOfAddressByTypesHLF,
  getBalancesHLF,
  getAddressStreamingsOfTokensHLF,
  getStreamingsInfoHLF
} from 'shared/services/API';
import { IPFSContextProvider } from 'shared/contexts/IPFSContext';
import { MediaPlayerKeyContextProvider } from 'shared/contexts/MediaPlayerKeyContext';

export let socket: SocketIOClient.Socket;
export let listenerSocket: SocketIOClient.Socket;
export let playerSocket: SocketIOClient.Socket;
export const setSocket = (sock: SocketIOClient.Socket) => {
  socket = sock;
};
export const setListenerSocket = (sock: SocketIOClient.Socket) => {
  listenerSocket = sock;
};
export const setPlayerSocket = (sock: SocketIOClient.Socket) => {
  playerSocket = sock;
};

const Auth = () => {
  const dispatch = useDispatch();
  const [numberOfMessages, setNumberOfMessages] = useState<number>(0);

  // --------- for balance ---------
  const tokenTypeMap = useRef({}); // ref to tokenTypeMap given that setInterval cant get current state of useState hook

  // -------------------------------

  const user = useTypedSelector((state) => state.user);
  const selectedUserSelector = useSelector(
    (state: RootState) => state.selectedUser
  );

  // NOTE: this hack is required to trigger re-render
  const [
    internalSocket,
    setInternalSocket
  ] = useState<SocketIOClient.Socket | null>(null);

  const timerRef = useRef<any>();
  const playerTimerRef = useRef<any>();

  useEffect(() => {
    startFunctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchExternalBalance(selectedUserSelector.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserSelector.id]);

  useEffect(() => {
    if (user) {
      const userId = user.id;
      if (userId) {
        axios
          .get(`${URL()}/user/getUserCounters/${userId}`)
          .then((res) => {
            const resp = res.data;
            if (resp.success) {
              const data = resp.data;
              setNumberOfMessages(data.myUnseenMessagesCount ?? 0);
            }
          })
          .catch((err) => console.log('getUserCounters error: ', err));
        if (!socket) {
          const sock = io(URL(), {
            query: { token: Cookies.get('accessToken') || '' },
            transports: ['websocket']
          });
          sock.on('connected', () => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          });
          sock.connect();
          setSocket(sock);
          sock.emit(
            'add user',
            localStorage.getItem('userId')?.toString() || ''
          );
          sock.on('disconnect', () => {
            timerRef.current = setInterval(() => {
              sock.connect();
            }, 5000);
          });
        }
        socket && socket.emit('subscribeToYou', { _id: userId });

        // set socket with Listener
        if (!listenerSocket) {
          const listenerSock = io(LISTENER_URL(), {});
          listenerSock.connect();
          setListenerSocket(listenerSock);
        }
        listenerSocket && listenerSocket.emit("connectTest");

        if (!playerSocket) {
          const sock = io(IPFSURL(), {
            query: { token: Cookies.get('accessToken') || '' },
            transports: ['websocket']
          });
          sock.on('connected', () => {
            if (playerTimerRef.current) {
              clearInterval(playerTimerRef.current);
            }
          });
          sock.connect();
          setPlayerSocket(sock);
          sock.on('disconnect', () => {
            playerTimerRef.current = setInterval(() => {
              sock.connect();
            }, 5000);
          });
        }
      }
    }
  }, [user.id]);

  const loadDataToReduxStore = (data) => {
    // music balance
    fetchBalanceData(data.address);
    // setInterval(() => {
    //   fetchBalanceData(data.address);
    // }, 300 * 1000);
    // external ethereum wallet
    fetchExternalBalance(data.id);
  };

  // get token list and call getStreamUpdateInfo for each token
  const fetchBalanceData = async (userAddress) => {
    try {
      const newUserBalances: { [key: string]: BalanceModel } = {};
      // get token list and corresponding type
      const tokenTypes = ['CRYPTO', 'NFTMEDIA', 'MEDIAPOD', 'SOCIAL'];
      const tokenTypeResps = await getTokenOfAddressByTypesHLF(
        userAddress,
        tokenTypes,
        '',
        ''
      );
      tokenTypeResps.forEach((resp, index) => {
        if (resp?.success) {
          (resp.output ?? []).forEach(
            (token) =>
              (newUserBalances[token] = {
                Token: token,
                Type: tokenTypes[index],
                InitialBalance: 0,
                Balance: 0,
                AmountPerSecond: 0,
                Debt: 0,
                NextUpdate: Infinity,
                LastUpdate: Math.floor(Date.now() / 1000)
              })
          );
        }
      });
      // get token balances
      const tokens = Object.keys(newUserBalances);
      const getBalanceResps = await getBalancesHLF(userAddress, tokens);
      getBalanceResps.forEach((resp) => {
        if (resp?.success) {
          const output = resp.output;
          newUserBalances[output.Token] = {
            ...newUserBalances[output.Token],
            InitialBalance: output.Amount,
            Balance: output.Amount,
            Debt: output.Debt
          };
        }
      });
      // get streaming ids
      const streamingIds: string[] = [];
      const streamingsIdResp = await getAddressStreamingsOfTokensHLF(
        userAddress,
        tokens
      );
      streamingsIdResp.forEach((resp) => {
        if (resp?.success) {
          const output = resp.output;
          const incoming = output.Incoming ?? {};
          const outgoing = output.Outgoing ?? {};
          [...Object.keys(incoming), ...Object.keys(outgoing)].forEach((id) =>
            streamingIds.push(id)
          );
        }
      });
      // get streaming info
      const streamingsInfoResp = await getStreamingsInfoHLF(streamingIds);
      streamingsInfoResp.forEach((resp) => {
        if (resp?.success) {
          const output = resp.output;
          const receiver = output.ReceiverAddress;
          const token = output.Token;
          const amount = output.Amount ?? 0;
          const frequency = output.Frequency ?? 1;
          let amountPerSecond = amount / frequency;
          if (receiver != userAddress) amountPerSecond *= -1;
          newUserBalances[token] = {
            ...newUserBalances[token],
            AmountPerSecond:
              newUserBalances[token].AmountPerSecond + amountPerSecond,
            NextUpdate: output.EndingDate
          };
        }
      });
      dispatch(setBalances(newUserBalances));
    } catch (e) {
      console.log(e);
    }
  };

  const fetchExternalBalance = (uid) => {
    if (uid) {
      axios
        .get(`${URL()}/wallet/getUserOwnedTokens?userId=${uid}`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.data;
            dispatch(setEthExternalWallet(data));
          }
        });
    }
  };

  const startFunctions = () => {
    let token: string = Cookies.get('accessToken') || '';
    let userId: string = localStorage.getItem('userId') || '';
    if (
      !token ||
      token === '' ||
      token === 'undefined' ||
      !userId ||
      userId === '' ||
      userId === 'undefined'
    ) {
    } else {
      // do we need to load the data?
      if (!user.email) {
        axios
          .get(`${URL()}/user/getLoginInfo/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            if (response.data.success) {
              const data = response.data.data;
              const socket = io(URL(), {
                query: { token: token },
                transports: ['websocket']
              });
              socket.on('connected', () => {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                }
              });
              socket.connect();
              setInternalSocket(socket);
              socket.emit('add user', data.id);
              socket.on('disconnect', () => {
                timerRef.current = setInterval(() => {
                  socket.connect();
                }, 5000);
              });

              loadDataToReduxStore(data); //load data to redux store
              dispatch(setUser(data));
              axios.defaults.headers.common['Authorization'] =
                'Bearer ' + token;
              dispatch(setLoginBool(true));
            }
          })
          .catch((error) => {
            console.log(error);
            // alert("Error getting basic Info");
          });
      }
    }
  };

  return (
    <Router>
      <AuthContextProvider>
        <IPFSContextProvider>
          <MediaPlayerKeyContextProvider>
            <PageRefreshContextProvider>
              <ShareMediaContextProvider>
                <MessagesContextProvider
                  socket={internalSocket}
                  numberMessages={numberOfMessages}
                >
                  <NotificationsContextProvider socket={internalSocket}>
                    <UserConnectionsContextProvider>
                      <TokenConversionContextProvider>
                        <>
                          <NavBar />
                        </>
                      </TokenConversionContextProvider>
                    </UserConnectionsContextProvider>
                  </NotificationsContextProvider>
                </MessagesContextProvider>
              </ShareMediaContextProvider>
            </PageRefreshContextProvider>
          </MediaPlayerKeyContextProvider>
        </IPFSContextProvider>
      </AuthContextProvider>
    </Router>
  );
};

export default Auth;
