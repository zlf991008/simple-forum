export function fType(type) {
  // switch (type) {
  //   case 'SHARE_MOOD':
  //     return 'Share Mood';
  //   case 'SEEK_HELP':
  //     return 'Seek Help';
  //   case 'SEEK_LOST_PROP':
  //     return 'Seek Lost Property';
  //   case 'SEEK_OWNER':
  //     return 'Seek Owner';
  //   case 'BUY_STH':
  //     return 'Buy Something';
  //   case 'SELL_STH':
  //     return 'Sell Something';
  //   default:
  //     return 'Unknown Type';
  // }

  switch (type) {
    case 'SHARE_MOOD':
      return '分享心情';
    case 'SEEK_HELP':
      return '求助';
    case 'SEEK_LOST_PROP':
      return '找失物';
    case 'SEEK_OWNER':
      return '找失主';
    case 'BUY_STH':
      return '买东西';
    case 'SELL_STH':
      return '卖东西';
    default:
      return 'Unknown Type';
  }
}
