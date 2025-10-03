FROM ubuntu:22.04

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y snmpd snmp && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY snmpd.conf /etc/snmp/snmpd.conf
COPY snmp-scripts/ /usr/local/bin/snmp-scripts/

RUN chmod +x /usr/local/bin/snmp-scripts/notifications/*.sh

# Ensure SNMP runtime directories exist and are owned correctly
RUN mkdir -p /var/lib/snmp /var/run/snmp && chown -R Debian-snmp:Debian-snmp /var/lib/snmp /var/run/snmp

EXPOSE 161/udp

CMD ["snmpd", "-f", "-Le", "-C", "-c", "/etc/snmp/snmpd.conf"]
