const invoices = require('./database/invoices.json');
const plays = require('./database/plays.json');

function statement(invoice, plays) {
  let result = `Statement for ${invoice[0].customer}\n`;

  for (let perf of invoice[0].performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf)/100)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  
  return result;  
}

function totalAmount() {
  let result = 0;
  for (let perf of invoices[0].performances) {
    result += amountFor(perf);
  }
  return result;
}

function totalVolumeCredits() {
  let result = 0;
  for (let perf of invoices[0].performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber);
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if ("comedy" === playFor(aPerformance).type)
    result += Math.floor(aPerformance.audience / 5);
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
  let result = 0

  switch (playFor(aPerformance).type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${playFor(aPerformance).type}`);
  }
  
  return result;
}

console.log(statement(invoices, plays));