export const getPodStatus = (pod: any) => {
  if (!pod.WithFunding) {
    return 'Funded';
  }
  if (
    pod &&
    pod.FundingDate &&
    pod.FundingDate > Math.trunc(Date.now() / 1000)
  ) {
    if ((pod.RaisedFunds || 0) >= pod.FundingTarget) return 'Sold out';
    else return 'Funding';
  } else if (
    pod &&
    pod.FundingDate &&
    pod.FundingDate <= Math.trunc(Date.now() / 1000) &&
    (pod.RaisedFunds || 0) < pod.FundingTarget
  ) {
    return 'Funding Failed';
  } else if (
    pod &&
    pod.FundingDate &&
    pod.FundingDate <= Math.trunc(Date.now() / 1000) &&
    (pod.RaisedFunds || 0) >= pod.FundingTarget
  ) {
    return 'Funded';
  } else {
    return '';
  }
};

export const checkObjectEmpty = (object: any): boolean => {
  return Object.entries(object || {}).length ? false : true;
};
