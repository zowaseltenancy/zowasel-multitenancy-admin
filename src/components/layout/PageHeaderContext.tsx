"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface PageHeaderValue {
  title: string | null;

  description: string | null;
}

interface PageHeaderContextValue extends PageHeaderValue {
  setPageHeader: (value: PageHeaderValue) => void;
}

const PageHeaderContext =
  createContext<PageHeaderContextValue | null>(null);

export function PageHeaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [header, setHeader] =
    useState<PageHeaderValue>({
      title: null,
      description: null,
    });

  const value = useMemo(
    () => ({
      ...header,
      setPageHeader: setHeader,
    }),
    [header]
  );

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}

function usePageHeaderContext() {
  const context = useContext(PageHeaderContext);

  if (!context) {
    throw new Error(
      "usePageHeaderContext must be used within PageHeaderProvider"
    );
  }

  return context;
}

export function usePageHeader(
  title: string,
  description?: string
) {
  const { setPageHeader } =
    usePageHeaderContext();

  useEffect(() => {
    setPageHeader({
      title,
      description: description ?? null,
    });

    return () =>
      setPageHeader({
        title: null,
        description: null,
      });
  }, [title, description, setPageHeader]);
}

export function usePageHeaderValue() {
  return usePageHeaderContext();
}
