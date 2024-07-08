import React, { useRef, useEffect, useState, useCallback } from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import waveformAvgChunker from './waveformAvgChunker';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';

import classes from './Waveform.module.css';

const pointCoordinates = ({
  index,
  pointWidth,
  pointMargin,
  canvasHeight,
  amplitude
}) => {
  const pointHeight = Math.round((amplitude / 300) * canvasHeight);
  const verticalCenter = Math.round((canvasHeight - pointHeight) / 2);
  return [
    index * (pointWidth + pointMargin), // x starting point
    canvasHeight - pointHeight - verticalCenter, // y starting point
    pointWidth, // width
    pointHeight // height
  ];
};

const paintCanvas = ({
  canvasRef,
  waveformData,
  canvasHeight,
  pointWidth,
  pointMargin,
  playingPoint,
  hoverXCoord,
  isFromPlayer
}) => {
  const ref = canvasRef.current;
  const ctx = ref.getContext('2d');
  // On every canvas update, erase the canvas before painting
  // If you don't do this, you'll end up stacking waveforms and waveform
  // colors on top of each other
  ctx.clearRect(0, 0, ref.width, ref.height);
  waveformData.forEach((p, i) => {
    ctx.beginPath();
    const coordinates = pointCoordinates({
      index: i,
      pointWidth,
      pointMargin,
      canvasHeight,
      amplitude: p
    });
    ctx.rect(...coordinates);
    if (isFromPlayer) {
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    const withinHover = hoverXCoord >= coordinates[0];
    const alreadyPlayed = i < playingPoint;
    if (withinHover) {
      ctx.fillStyle = alreadyPlayed ? '#94b398' : '#badebf';
    } else if (alreadyPlayed) {
      if (i < playingPoint / 2) ctx.fillStyle = '#00DCDE';
      else ctx.fillStyle = '#00F0B6';
      if (!isFromPlayer) ctx.fillStyle = '#20d450';
    } else {
      ctx.fillStyle = isFromPlayer ? '#ffffff' : '#88bf9980';
    }
    if (isFromPlayer) {
      ctx.fill();
      if (alreadyPlayed) ctx.fill();
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 15;
      ctx.fill();

      ctx.beginPath();
      if (coordinates[3] + coordinates[1] - canvasHeight * 0.6 > 0) {
        ctx.rect(
          coordinates[0],
          canvasHeight * 0.6,
          coordinates[2],
          coordinates[3] + coordinates[1] - canvasHeight * 0.6
        );
        ctx.fillStyle = '#000000ff';
        ctx.fill();
      }
    }
    ctx.fill();
  });
};

const Waveform = ({
  waveformData,
  waveformMeta,
  onSeek,
  trackProgress,
  height = 0
}) => {
  const canvasRef = useRef<any>();
  const chunkedData = waveformAvgChunker(waveformData, height > 0 ? 250 : 200);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const width = useWindowDimensions().width;
  const waveformWidth = React.useMemo(() => {
    if (canvasRef.current) {
      return canvasRef.current.clientWidth;
    }
    return 0;
  }, [width, canvasRef.current]);

  const canvasHeight = height > 0 ? height : isMobile ? 140 : 168;
  const pointWidth = 0.5;
  const pointMargin = 4.2;
  const { trackDuration } = waveformMeta;
  const [hoverXCoord, setHoverXCoord] = useState<any>();
  const playingPoint =
    (trackProgress * waveformWidth) / 100 / (pointWidth + pointMargin);

  const paintWaveform = useCallback(() => {
    paintCanvas({
      canvasRef,
      waveformData: chunkedData,
      canvasHeight,
      pointWidth,
      pointMargin,
      playingPoint,
      hoverXCoord,
      isFromPlayer: height > 0
    });
  }, [playingPoint]);

  useEffect(() => {
    if (canvasRef.current) {
      paintWaveform();
    }
  }, [canvasRef, waveformWidth, playingPoint]);

  const setDefaultX = useCallback(() => {
    setHoverXCoord(undefined);
  }, []);

  const handleMouseMove = useCallback((e) => {
    setHoverXCoord(
      e.clientX - canvasRef?.current?.getBoundingClientRect()?.left
    );
  }, []);

  const seekTrack = (e) => {
    const xCoord =
      e.clientX - canvasRef?.current?.getBoundingClientRect()?.left;
    let realWidth =
      canvasRef?.current?.getBoundingClientRect()?.right -
      canvasRef?.current?.getBoundingClientRect()?.left;
    const seekPerc = (xCoord * 100) / realWidth;
    const seekMs = (trackDuration * seekPerc) / 100;
    onSeek((seekMs ?? trackDuration) / 1000);
  };

  return (
    <div style={{ width: '100%' }}>
      <canvas
        className={classes.canvas}
        style={{ height: canvasHeight, width: '100%' }}
        ref={canvasRef}
        height={canvasHeight}
        width={waveformWidth}
        onBlur={setDefaultX}
        onMouseOut={setDefaultX}
        // onMouseMove={handleMouseMove}
        onClick={seekTrack}
      />
    </div>
  );
};

export default Waveform;
