import {
  AppWindow,
  ArrowLeftRight,
  BrainCircuit,
  ChartColumn,
  Cpu,
  FileCheck,
  FlaskConical,
  Handshake,
  Network,
  RefreshCw,
  Server,
  ShieldCheck,
  ShoppingCart,
  Users,
} from '@lucide/astro';
import type { Service } from '../../data/yi-ai';

/** One mark per service, used wherever the site used to print layer codes. */
export const serviceIcons: Record<Service, typeof Server> = {
  workbuddy: AppWindow,
  'model-services': BrainCircuit,
  infrastructure: Server,
};

/** Scenario icons, in the same order as `ServiceCopy.scenarios` in both languages. */
export const scenarioIcons: Record<Service, (typeof Server)[]> = {
  workbuddy: [ShoppingCart, Users, FileCheck, RefreshCw],
  'model-services': [ArrowLeftRight, ChartColumn, FlaskConical, Handshake],
  infrastructure: [Server, Cpu, ShieldCheck, Network],
};
