export interface InventoryLog {
  id: number;
  product: {
    id: number;
    name: string;
  };
  changeType: 'ADD' | 'REMOVE' | 'ADJUST';
  quantityChanged: number;
  timestamp: Date;
  notes?: string;
}

export interface InventoryAdjustment {
  productId: number;
  quantity: number;
  notes?: string;
}

export interface DashboardSummary {
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
  todayTransactions: number;

  // Pie Chart: Category Distribution
  categoryBreakdown: CategoryStock[];

  // Activity Feed (latest inventory actions)
  recentActivities: RecentActivity[];

  // Bar Chart: Transactions per Month
  monthlyTransactions: { [month: string]: number };
}

export interface CategoryStock {
  category: string;
  count: number;
  lowStockCount: number;
}

export interface RecentActivity {
  productName: string;
  action: 'ADD' | 'REMOVE' | 'ADJUST';
  quantity: number;
  timestamp: string;
}
