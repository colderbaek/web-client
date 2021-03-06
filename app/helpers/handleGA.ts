import * as ReactGA from "react-ga";

export function trackAndOpenLink(from: string) {
  ReactGA.outboundLink(
    {
      label: from,
    },
    () => {},
  );
}

interface TrackEventParmas {
  category: string;
  action: string;
  label: string;
}

export function trackEvent({ category, action, label }: TrackEventParmas) {
  ReactGA.event({
    category,
    action,
    label,
  });
}

/* will be deprecated */
export function trackAction(path: string, from: string) {
  ReactGA.event({
    category: "link-click",
    action: `click-from-${from}`,
    label: path,
  });
}

/* will be deprecated */
export function trackSearch(action: string, label: string) {
  ReactGA.event({
    category: "search",
    action,
    label,
  });
}

export function trackModalView(name: string) {
  ReactGA.modalview(name);
}

export function measureTiming(category: string, variable: string, consumedTime: number) {
  ReactGA.timing({
    category,
    variable,
    value: consumedTime,
  });
}
