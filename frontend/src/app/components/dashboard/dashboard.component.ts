import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DashboardService } from '../../services/dashboard.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

import { DashboardSummary, RecentActivity } from '../../models/inventory-log.model';
import { Product } from '../../models/product.model';

import { ChartConfiguration, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Dashboard data
  dashboardData: DashboardSummary | null = null;
  lowStockProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  // Chart: Category Overview (Pie)
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: []
  };
  public pieChartType: ChartType = 'pie';

  // Chart: Monthly Trends (Bar)
  public barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: []
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadLowStockProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load dashboard summary data (including chart values)
   */
  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    const dashboardSub = this.dashboardService.getDashboardSummary()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data: DashboardSummary) => {
          this.dashboardData = data;

          // Pie Chart: Category Breakdown
          this.pieChartData = {
            labels: data.categoryBreakdown.map(c => c.category),
            datasets: [
              { data: data.categoryBreakdown.map(c => c.count) }
            ]
          };

          // Bar Chart: Monthly Transactions
          const months = Object.keys(data.monthlyTransactions);
          const values = Object.values(data.monthlyTransactions);

          this.barChartData = {
            labels: months,
            datasets: [
              { data: values, label: 'Transactions' }
            ]
          };
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.error = 'Failed to load dashboard data';
          this.toastService.error('Dashboard Error', 'Failed to load dashboard data. Please try again.');
        }
      });

    this.subscriptions.push(dashboardSub);
  }

  /**
   * Load low stock product list
   */
  loadLowStockProducts(): void {
    const lowStockSub = this.productService.getLowStockProducts()
      .subscribe({
        next: (products: Product[]) => {
          this.lowStockProducts = products;

          if (products.length > 0) {
            this.toastService.warning(
              'Low Stock Alert',
              `You have ${products.length} product(s) with low stock levels.`,
              false
            );
          }
        },
        error: (error) => {
          console.error('Error loading low stock products:', error);
          this.toastService.error('Error', 'Failed to load low stock products.');
        }
      });

    this.subscriptions.push(lowStockSub);
  }

  /**
   * Refresh dashboard data
   */
  refreshData(): void {
    this.loadDashboardData();
    this.loadLowStockProducts();
    this.toastService.success('Data Refreshed', 'Dashboard data has been updated.');
  }

  /**
   * Format activity date
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  /**
   * Get user-friendly activity description
   */
  getActivityDescription(activity: RecentActivity): string {
    const action = activity.action.toLowerCase();
    const quantity = Math.abs(activity.quantity);

    switch (action) {
      case 'add':
        return `Added ${quantity} units`;
      case 'remove':
        return `Removed ${quantity} units`;
      case 'adjust':
        return `Adjusted by ${activity.quantity > 0 ? '+' : ''}${activity.quantity} units`;
      default:
        return `${activity.action} ${quantity} units`;
    }
  }
}
