
const url = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
const response = await fetch(url);
const data = await response.json();
const ip_ranges = data["prefixes"];

const amazon_ips = ip_ranges.filter(it => it['service'] == 'AMAZON').map(it => it['ip_prefix']);

const ec2_ips = ip_ranges.filter(it => it['service'] == 'EC2').map(it => it['ip_prefix']);

const amazon_ips_less_ec2 = amazon_ips.filter(it => {
  let isInEC2 = false;
  for (let i of ec2_ips) {
    if (it == i) {
      isInEC2 = true;
      break;
    }
  }
  return !isInEC2;
});

console.log(amazon_ips_less_ec2);