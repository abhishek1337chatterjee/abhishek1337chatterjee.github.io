// Where each known cloud service sits in the architecture graph, and how they connect.
// Names match Sanity skill names; a CMS service missing here falls back to a plain chip.

export type NodeRole = 'service' | 'hub' | 'bus' | 'agent' | 'tool';

interface Slot {
  col: number;
  row: number;
  span?: number;
}

export interface GraphNode {
  name: string;
  role: NodeRole;
  wide: Slot; // lg+: left-to-right flow, 5 columns
  narrow: Slot; // below lg: top-to-bottom flow, 2 columns
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  delay: number; // seconds into the packet loop, so one request walks the system
}

export const GRAPH_NODES: GraphNode[] = [
  { name: 'Cognito', role: 'service', wide: { col: 1, row: 2 }, narrow: { col: 1, row: 1 } },
  { name: 'Lambda', role: 'hub', wide: { col: 2, row: 2 }, narrow: { col: 1, row: 2 } },
  { name: 'EventBridge', role: 'bus', wide: { col: 3, row: 2 }, narrow: { col: 1, row: 3 } },
  { name: 'SQS', role: 'service', wide: { col: 4, row: 1 }, narrow: { col: 1, row: 4 } },
  { name: 'Step Functions', role: 'service', wide: { col: 5, row: 1 }, narrow: { col: 1, row: 5 } },
  { name: 'SNS', role: 'service', wide: { col: 4, row: 3 }, narrow: { col: 2, row: 4 } },
  { name: 'SES', role: 'service', wide: { col: 5, row: 3 }, narrow: { col: 2, row: 5 } },
  {
    name: 'Bedrock AgentCore',
    role: 'agent',
    wide: { col: 2, row: 4, span: 2 },
    narrow: { col: 2, row: 2 },
  },
  { name: 'Temporal.io', role: 'tool', wide: { col: 4, row: 4 }, narrow: { col: 1, row: 6 } },
  { name: 'AWS SAM', role: 'tool', wide: { col: 5, row: 4 }, narrow: { col: 2, row: 6 } },
];

export const GRAPH_EDGES: GraphEdge[] = [
  { from: 'Cognito', to: 'Lambda', label: 'auth', delay: 0 },
  { from: 'Lambda', to: 'EventBridge', label: 'events', delay: 0.75 },
  { from: 'Lambda', to: 'Bedrock AgentCore', label: 'agents', delay: 0.75 },
  { from: 'EventBridge', to: 'SQS', label: 'fan-out', delay: 1.5 },
  { from: 'EventBridge', to: 'SNS', delay: 1.5 },
  { from: 'SQS', to: 'Step Functions', delay: 2.25 },
  { from: 'SNS', to: 'SES', delay: 2.25 },
];

// One full request walk; each packet travels for the first 20% of it.
export const PACKET_LOOP_S = 3.6;
