
FROM ubuntu:22.04

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y snmpd snmp snmp-mibs-downloader && \
    sed -i 's/^mibs :/# mibs :/' /etc/snmp/snmp.conf && \
    download-mibs && \
    echo "mibs :" > /etc/snmp/snmp.conf && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV MIBS=

# Set MIB search path and copy custom MIBs
ENV MIBDIRS=/usr/share/snmp/mibs:/mibs
COPY mibs /usr/share/snmp/mibs

COPY apps/agents/payments/snmpd.conf /etc/snmp/snmpd.conf
COPY apps/agents/payments/snmp-scripts/ /usr/local/bin/snmp-scripts/

RUN chmod +x /usr/local/bin/snmp-scripts/payments/*.sh

# Ensure SNMP runtime directories exist and are owned correctly
RUN mkdir -p /var/lib/snmp /var/run/snmp && chown -R Debian-snmp:Debian-snmp /var/lib/snmp /var/run/snmp

EXPOSE 161/udp

CMD ["snmpd", "-f", "-Le", "-C", "-c", "/etc/snmp/snmpd.conf"]
