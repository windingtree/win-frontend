import { utils, BigNumber } from 'ethers';

// Makes shorter text with ellipsis in the center
export const centerEllipsis = (text: string, width = 4, prefix = 2): string =>
  text
    ? text.length > width * 2 + prefix
      ? `${text.substring(0, width + prefix)}...${text.substring(
          text.length - width - prefix
        )}`
      : text
    : '';

// Copies text to clipboard
export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    const resolve = await navigator.clipboard.writeText(text);
    return resolve;
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand('copy') ? resolve() : reject();
      textArea.remove();
    });
  }
};

export const formatPrice = (
  value: BigNumber,
  currency?: string | undefined,
  decimal?: number | undefined
): string => {
  let fmtdPrice = `${Number(utils.formatUnits(value, decimal ?? 18)).toFixed(2)}`;

  if (currency && currency.length) {
    fmtdPrice += ` ${currency}`;
  }

  return fmtdPrice;
};

export const stringToNumber = (
  value: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any,
  throwError = true
) => {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    if (defaultValue) return defaultValue;
    if (throwError)
      throw new Error(`Error: string to number conversion - invalid string "${value}"`);
    return undefined;
  }

  return numberValue;
};
