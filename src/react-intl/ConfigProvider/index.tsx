import React, { type FC, createContext } from 'react';

/** `'en-US' | 'en' | 'zh-CN' | 'zh'` */
export type ISupportedLocale = 'en-US' | 'en' | 'zh-CN' | 'zh' | string;

interface IProps {
  locale: ISupportedLocale;
  children?: React.ReactNode;
}

interface LocaleContextProps {
  locale?: ISupportedLocale;
}

export const LocaleContext = createContext<LocaleContextProps>({});

const ConfigProvider: FC<IProps> = ({ locale, children }) => {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default ConfigProvider;
