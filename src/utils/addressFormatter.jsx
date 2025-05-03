export function formatAddress(address1, address2, address3) {
  if (!address1) {
    return null;
  }

  const formattedAddress = [address1, address2, address3]
    .filter(address => address !== null && address !== undefined)
    .map((address) => {
      if (address.trim().endsWith(',')) {
        return address.trim().slice(0, -1);
      }
      return address.trim();
    })
    .join(', ');

  return formattedAddress.replace(/, $/, '');
}