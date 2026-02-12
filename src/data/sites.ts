export interface Level2Item {
  id: string;
  code: string;
  zip: string;
  address: string;
  city: string;
  country: string;
}

export interface Level1Item {
  id: string;
  name: string;
  abbreviationName: string;
  zip: string;
  address: string;
  city: string;
  country: string;
  level2: Level2Item[];
}

export interface SitesData {
  level1: Level1Item[];
}

export const sitesData: SitesData = {
  level1: [
    {
      id: "site-1",
      name: "Site L 1",
      abbreviationName: "STE I",
      zip: "95500",
      address: "Mühlstraße 4",
      city: "Heinersreuth",
      country: "Germany",
      level2: [
        { id: "BT-123450L", code: "2013/57", zip: "95500", address: "Mühlstraße 4", city: "Heinersreuth", country: "Germany" },
        { id: "BT-123452L", code: "2012/04", zip: "95500", address: "Mühlstraße 4", city: "Heinersreuth", country: "Germany" },
        { id: "BT-123455L", code: "2011/32", zip: "95500", address: "Mühlstraße 4", city: "Heinersreuth", country: "Germany" },
        { id: "BT-123456L", code: "2014/78", zip: "95500", address: "Mühlstraße 4", city: "Heinersreuth", country: "Germany" },
      ],
    },
    {
      id: "site-2",
      name: "Site L 2",
      abbreviationName: "STE II",
      zip: "95511",
      address: "Röthstraße 8",
      city: "Mistelbach",
      country: "Germany",
      level2: [
        { id: "KU-456780L", code: "2013/56", zip: "95511", address: "Röthstraße 8", city: "Mistelbach", country: "Germany" },
        { id: "KU-456782L", code: "2013/48", zip: "95511", address: "Röthstraße 8", city: "Mistelbach", country: "Germany" },
        { id: "KU-456783L", code: "2014/90", zip: "95511", address: "Röthstraße 8", city: "Mistelbach", country: "Germany" },
        { id: "KU-456784L", code: "2014/23", zip: "95511", address: "Röthstraße 8", city: "Mistelbach", country: "Germany" },
      ],
    },
    {
      id: "site-3",
      name: "Site L 3",
      abbreviationName: "STE III",
      zip: "95488",
      address: "Heumannsberg 11",
      city: "Eckersdorf",
      country: "Germany",
      level2: [
        { id: "NBG-789010L", code: "2011/34", zip: "95488", address: "Heumannsberg 11", city: "Eckersdorf", country: "Germany" },
        { id: "NBG-789012L", code: "2010/28", zip: "95488", address: "Heumannsberg 11", city: "Eckersdorf", country: "Germany" },
        { id: "NBG-789017L", code: "2011/95", zip: "95488", address: "Heumannsberg 11", city: "Eckersdorf", country: "Germany" },
        { id: "NBG-789018L", code: "2009/87", zip: "95488", address: "Heumannsberg 11", city: "Eckersdorf", country: "Germany" },
      ],
    },
  ],
};
