// Mock data for the payment reconciliation system

export const mockCaptureData = {
  kpis: {
    awaitingCapture: 23,
    avgLagP50: 45,
    avgLagP90: 95,
    slaBreaches: 5,
  },
  orders: [
    {
      orderReference: "ORD-2024-00123",
      deliveredAt: "2024-01-15T11:45:00Z",
      expectedAmount: 95.97,
      capturedAmount: null,
      lagMinutes: 135,
    },
    {
      orderReference: "ORD-2024-00124",
      deliveredAt: "2024-01-15T12:20:00Z",
      expectedAmount: 45.50,
      capturedAmount: null,
      lagMinutes: 100,
    },
    {
      orderReference: "ORD-2024-00125",
      deliveredAt: "2024-01-15T13:00:00Z",
      expectedAmount: 152.30,
      capturedAmount: null,
      lagMinutes: 80,
    },
    {
      orderReference: "ORD-2024-00126",
      deliveredAt: "2024-01-15T13:30:00Z",
      expectedAmount: 67.80,
      capturedAmount: null,
      lagMinutes: 50,
    },
    {
      orderReference: "ORD-2024-00127",
      deliveredAt: "2024-01-15T14:00:00Z",
      expectedAmount: 203.45,
      capturedAmount: null,
      lagMinutes: 20,
    },
  ],
};

export const mockPayoutFile = {
  summary: {
    rowCount: 145,
    totalNetAmount: 45632.18,
    dateRangeStart: "2024-01-01",
    dateRangeEnd: "2024-01-15",
  },
  buckets: {
    EXACT_3WAY: [
      {
        payoutReference: "PAY-2024-00234",
        transactionId: "TXN-789012",
        postingDate: "2024-01-15",
        netAmount: 95.97,
        bucket: "EXACT_3WAY",
        linkedPayment: "ORD-2024-00120",
      },
      {
        payoutReference: "PAY-2024-00235",
        transactionId: "TXN-789013",
        postingDate: "2024-01-15",
        netAmount: 152.30,
        bucket: "EXACT_3WAY",
        linkedPayment: "ORD-2024-00121",
      },
    ],
    EXACT_2WAY: [
      {
        payoutReference: "PAY-2024-00236",
        transactionId: "TXN-789014",
        postingDate: "2024-01-15",
        netAmount: 67.80,
        bucket: "EXACT_2WAY",
        linkedPayment: "ORD-2024-00122",
      },
      {
        payoutReference: "PAY-2024-00237",
        transactionId: "TXN-789015",
        postingDate: "2024-01-15",
        netAmount: 203.45,
        bucket: "EXACT_2WAY",
        linkedPayment: "ORD-2024-00123",
      },
    ],
    UNMATCHED: [
      {
        payoutReference: "PAY-2024-00238",
        transactionId: "TXN-789016",
        postingDate: "2024-01-15",
        netAmount: 45.50,
        bucket: "UNMATCHED",
        linkedPayment: null,
      },
      {
        payoutReference: "PAY-2024-00239",
        transactionId: "TXN-789017",
        postingDate: "2024-01-15",
        netAmount: 178.90,
        bucket: "UNMATCHED",
        linkedPayment: null,
      },
    ],
    AMOUNT_DIFF: [
      {
        payoutReference: "PAY-2024-00240",
        transactionId: "TXN-789018",
        postingDate: "2024-01-15",
        netAmount: 94.97,
        bucket: "AMOUNT_DIFF",
        linkedPayment: "ORD-2024-00125",
      },
    ],
  },
};

export const mockGLFile = {
  summary: {
    recordCount: 230,
    totalAmount: 67845.92,
    threeWayMatches: 12,
  },
  records: [
    {
      glReference: "GL-2024-00456",
      transactionDate: "2024-01-15",
      accountCode: "4000",
      description: "Customer payment - PAY-2024-00234",
      debit: 95.97,
      credit: null,
      matched: true,
    },
    {
      glReference: "GL-2024-00457",
      transactionDate: "2024-01-15",
      accountCode: "4000",
      description: "Customer payment - PAY-2024-00235",
      debit: 152.30,
      credit: null,
      matched: true,
    },
    {
      glReference: "GL-2024-00458",
      transactionDate: "2024-01-15",
      accountCode: "4000",
      description: "Customer payment - PAY-2024-00236",
      debit: 67.80,
      credit: null,
      matched: true,
    },
    {
      glReference: "GL-2024-00459",
      transactionDate: "2024-01-15",
      accountCode: "4000",
      description: "Customer payment",
      debit: 345.60,
      credit: null,
      matched: false,
    },
  ],
};

export const mockExceptions = [
  {
    id: "EXC-001",
    orderReference: "ORD-2024-00145",
    store: "Store London Central",
    amount: 95.97,
    reasonCode: "AMOUNT_MISMATCH",
    ageDays: 8,
    assignedTo: "Sarah Johnson",
  },
  {
    id: "EXC-002",
    orderReference: "ORD-2024-00146",
    store: "Store Manchester",
    amount: 152.30,
    reasonCode: "MISSING_CAPTURE",
    ageDays: 12,
    assignedTo: null,
  },
  {
    id: "EXC-003",
    orderReference: "ORD-2024-00147",
    store: "Store Birmingham",
    amount: 67.80,
    reasonCode: "DUPLICATE",
    ageDays: 2,
    assignedTo: "Mike Chen",
  },
  {
    id: "EXC-004",
    orderReference: "ORD-2024-00148",
    store: "Store Leeds",
    amount: 203.45,
    reasonCode: "PAYOUT_MISSING",
    ageDays: 5,
    assignedTo: null,
  },
  {
    id: "EXC-005",
    orderReference: "ORD-2024-00149",
    store: "Store Liverpool",
    amount: 45.50,
    reasonCode: "AMOUNT_MISMATCH",
    ageDays: 1,
    assignedTo: "Sarah Johnson",
  },
];
