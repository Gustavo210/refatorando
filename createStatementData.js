module.exports = function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
  function enrichPerformance(aPerformace) {
    const result = Object.assign({}, aPerformace);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }
  function playFor(aPerformace) {
    return plays[aPerformace.playID];
  }
  function amountFor(aPerformace) {
    let result = 0;
    switch (aPerformace.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformace.audience > 30) {
          result += 1000 * (aPerformace.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformace.audience > 20) {
          result += 10000 + 500 * (aPerformace.audience - 20);
        }
        result += 300 * aPerformace.audience;
        break;
      default:
        throw new Error(`unknown type: ${aPerformace.play.type}`);
    }
    return result;
  }
  function volumeCreditsFor(aPerformace) {
    let result = 0;
    result += Math.max(aPerformace.audience - 30, 0);
    if ("comedy" === aPerformace.play.type)
      result += Math.floor(aPerformace.audience / 5);
    return result;
  }
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
};
