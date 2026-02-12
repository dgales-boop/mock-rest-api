export interface Protocol {
  id: string;
  name: string;
  basedOn: string;
  date: string;
  owner: string;
  status: string;
}

export interface Level2Item {
  id: string;
  name: string;
  code: string;
  level1: string;
  zip: string;
  address: string;
  city: string;
  country: string;
  protocols: Protocol[];
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

const protocol1To9: Protocol[] = [
  { id: "protocol-1", name: "Demo Protokollmappe (v1)", basedOn: "Demo Protokollmappe (v1)", date: "28.01.2026 14:50", owner: "Demo Admin", status: "locked" },
  { id: "protocol-2", name: "Democall (v4)", basedOn: "Democall (v4)", date: "22.01.2026 13:06", owner: "Demo Admin", status: "locked" },
  { id: "protocol-3", name: "Demo Protokollmappe (v1)", basedOn: "Demo Protokollmappe (v1)", date: "22.01.2026 11:06", owner: "Demo Admin", status: "locked" },
  { id: "protocol-4", name: "Demo Protokollmappe (v1)", basedOn: "Demo Protokollmappe (v1)", date: "20.01.2026 12:18", owner: "Demo Admin", status: "locked" },
  { id: "protocol-5", name: "Democall (v3)", basedOn: "Democall (v3)", date: "19.01.2026 15:20", owner: "Demo Admin", status: "locked" },
  { id: "protocol-6", name: "Democall (v3)", basedOn: "Democall (v3)", date: "19.01.2026 15:16", owner: "Demo Admin", status: "locked" },
  { id: "protocol-7", name: "Democall (v3)", basedOn: "Democall (v3)", date: "16.01.2026 11:00", owner: "Demo Admin", status: "locked" },
  { id: "protocol-8", name: "Democall (v3)", basedOn: "Democall (v3)", date: "16.01.2026 09:40", owner: "Demo Admin", status: "locked" },
  { id: "protocol-9", name: "Democall (v3)", basedOn: "Democall (v3)", date: "13.01.2026 10:08", owner: "Demo Admin", status: "locked" },
];

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
        { id: "BT-123450L", name: "BT-123450L", code: "2013/57", level1: "Site L 1", zip: "95500", address: "Mühlstraße 4", city: "Heinersreuth", country: "Germany", protocols: protocol1To9 },
        { id: "BT-123452L", name: "BT-123452L", code: "2012/04", level1: "Site L 1", zip: "95500", address: "Mühlstraße 4", city: "Heinersreuth", country: "Germany", protocols: [{ id: "protocol-10", name: "Democall (v3)", basedOn: "Democall (v3)", date: "19.01.2026 14:22", owner: "Demo Admin", status: "locked" }] },
        { id: "BT-123455L", name: "BT-123455L", code: "2011/32", level1: "Site L 1", zip: "95500", address: "Mühlstraße 4", city: "Heinersreuth", country: "Germany", protocols: [] },
        { id: "BT-123456L", name: "BT-123456L", code: "2014/78", level1: "Site L 1", zip: "95500", address: "Mühlstraße 4", city: "Heinersreuth", country: "Germany", protocols: [] },
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
        { id: "KU-456780L", name: "KU-456780L", code: "2013/56", level1: "Site L 2", zip: "95511", address: "Röthstraße 8", city: "Mistelbach", country: "Germany", protocols: [] },
        { id: "KU-456782L", name: "KU-456782L", code: "2013/48", level1: "Site L 2", zip: "95511", address: "Röthstraße 8", city: "Mistelbach", country: "Germany", protocols: [] },
        { id: "KU-456783L", name: "KU-456783L", code: "2014/90", level1: "Site L 2", zip: "95511", address: "Röthstraße 8", city: "Mistelbach", country: "Germany", protocols: [] },
        { id: "KU-456784L", name: "KU-456784L", code: "2014/23", level1: "Site L 2", zip: "95511", address: "Röthstraße 8", city: "Mistelbach", country: "Germany", protocols: [] },
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
        { id: "NBG-789010L", name: "NBG-789010L", code: "2011/34", level1: "Site L 3", zip: "95488", address: "Heumannsberg 11", city: "Eckersdorf", country: "Germany", protocols: [] },
        { id: "NBG-789012L", name: "NBG-789012L", code: "2010/28", level1: "Site L 3", zip: "95488", address: "Heumannsberg 11", city: "Eckersdorf", country: "Germany", protocols: [] },
        { id: "NBG-789017L", name: "NBG-789017L", code: "2011/95", level1: "Site L 3", zip: "95488", address: "Heumannsberg 11", city: "Eckersdorf", country: "Germany", protocols: [] },
        { id: "NBG-789018L", name: "NBG-789018L", code: "2009/87", level1: "Site L 3", zip: "95488", address: "Heumannsberg 11", city: "Eckersdorf", country: "Germany", protocols: [] },
      ],
    },
  ],
};
