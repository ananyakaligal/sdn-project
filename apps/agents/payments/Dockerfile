FROM ubuntu:22.04

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y snmpd snmp && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY snmpd.conf /etc/snmp/snmpd.conf
COPY snmp-scripts/ /usr/local/bin/snmp-scripts/

RUN chmod +x /usr/local/bin/snmp-scripts/payments/*.sh

EXPOSE 161/udp

CMD ["snmpd", "-f", "-Le", "-c", "/etc/snmp/snmpd.conf"]
