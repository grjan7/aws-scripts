'use strict';

const awsIpsByServices = async (ipv = 4, service = 'amazon') => {

  if (ipv == 4 || ipv == 6) {
  } else {
    throw new Error("IP version must be 4 or 6.")
  }

  const ipVersion = ipv == 6 ? "ipv6_prefixes" : "prefixes";
  const ip_prefix = ipv == 6 ? "ipv6_prefix" : "ip_prefix";

  try {
    const url = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
    const response = await fetch(url);
    const data = await response.json();
    const ip_ranges = data[ipVersion];

    const services = new Set(ip_ranges.map(it => it.service));
    const aws_services_ips = {};

    services.forEach(it => {
      let regionwise_ips = {};
      let service_ips = ip_ranges.filter(ip => ip.service == it);

      service_ips.forEach(ip => {
        if (regionwise_ips[ip.region]) {
          regionwise_ips[ip.region].push(ip[ip_prefix]);
        } else {
          regionwise_ips[ip.region] = [ip[ip_prefix]];
        }
      });

      aws_services_ips[it.toLowerCase()] = regionwise_ips;
    });

    return aws_services_ips[service.toLowerCase()];

  } catch (e) {
    console.error(e);
  }
}

await awsIpsByServices("ec2");


/*
*
Type
{
  createDate: <string>,
    ipv6_prefixes: [{
      ipv6_prefix: <string>,
      network_border_group: <string>,
      region: <string>,
      service: <string>
    }],
    prefixes: [{
      ip_prefix: <string>,
      network_border_group: <string>,
      region: <string>,
      service: <string>
    }],
    syncToken: <string>
}
*/