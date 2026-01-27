export class DashboardStatsDto {
  activeTickets: number;
  dailyRevenue: number;
  dailyEntries: number;
  averageStayMs: number;
  averageStayFormatted: string;
  distribution: {
    cars: number;
    motorcycles: number;
    bicycles: number;
  };
  deliveryMethodDistribution: {
    digitalPhoto: number;
    digitalDownload: number;
    printed: number;
    unknown: number;
  };
}
