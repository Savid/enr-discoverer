# enr-discoverer

```bash
docker run -d --name enr-discoverer \
  -e "BOOT_NODES=enr:-Iq4QMCTfIMXnow27baRUb35Q8iiFHSIDBJh6hQM5Axohhf4b6Kr_cOCu0htQ5WvVqKvFgY28893DHAg8gnBAXsAVqmGAX53x8JggmlkgnY0gmlwhLKAlv6Jc2VjcDI1NmsxoQK6S-Cii_KmfFdUJL2TANL3ksaKUnNXvTCv1tLwXs0QgIN1ZHCCIyk" \
  -e "REMOTE_SEND_ENDPOINT=https://somewhere.example.com/enrs" \
  -e "SHARED_SECRET=abc123" \
  savid/enr-discoverer:latest
```
