import * as os from "os";

export function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = null;

  for (const interfaceName in networkInterfaces) {
    const addresses:os.NetworkInterfaceInfo[] | undefined = networkInterfaces[interfaceName];
    if(addresses) for(const addressInfo of addresses) {
      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
        ipAddress = addressInfo.address;
        break;
      }
    }
    if(ipAddress) break;
  }
  return ipAddress;
}