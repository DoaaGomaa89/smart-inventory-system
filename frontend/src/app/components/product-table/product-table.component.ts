import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { InventoryService } from '../../services/inventory.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Product, ProductPage } from '../../models/product.model';
import { InventoryAdjustment } from '../../models/inventory-log.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit, OnDestroy {
  public Math = Math;
  
  products: Product[] = [];
  categories: string[] = [];
  loading = true;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  pageSizes = [5, 10, 25, 50];
  
  // Filtering and Sorting
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'name';
  sortDirection = 'asc';
  
  // UI State
  showAdjustmentModal = false;
  selectedProduct: Product | null = null;
  adjustmentQuantity = 0;
  adjustmentNotes = '';
  adjustmentType: 'add' | 'remove' | 'adjust' = 'add';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private toastService: ToastService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    
    // Check for query parameters
    this.route.queryParams.subscribe(params => {
      if (params['filter'] === 'low-stock') {
        this.filterLowStock();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProducts(): void {
    this.loading = true;
    
    const sub = this.productService.getAllProducts(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.sortDirection,
      this.selectedCategory || undefined,
      this.searchTerm || undefined
    ).subscribe({
      next: (data: ProductPage) => {
        this.products = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error('Error', 'Failed to load products');
        console.error('Products loading error:', error);
      }
    });
    
    this.subscriptions.push(sub);
  }

  loadCategories(): void {
    const sub = this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Categories loading error:', error);
      }
    });
    
    this.subscriptions.push(sub);
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.sortBy = 'name';
    this.sortDirection = 'asc';
    this.currentPage = 0;
    this.loadProducts();
  }

  filterLowStock(): void {
    // This would ideally be handled by a backend filter, but for now we'll show all products
    // and highlight low stock ones
    this.toastService.info('Filter Applied', 'Showing all products with low stock highlighted');
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const sub = this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.toastService.success('Deleted', `Product "${product.name}" has been deleted`);
          this.loadProducts();
        },
        error: (error) => {
          this.toastService.error('Error', 'Failed to delete product');
          console.error('Delete error:', error);
        }
      });
      
      this.subscriptions.push(sub);
    }
  }

  openAdjustmentModal(product: Product, type: 'add' | 'remove' | 'adjust' = 'add'): void {
    this.selectedProduct = product;
    this.adjustmentType = type;
    this.adjustmentQuantity = type === 'adjust' ? product.quantity : 0;
    this.adjustmentNotes = '';
    this.showAdjustmentModal = true;
  }

  closeAdjustmentModal(): void {
    this.showAdjustmentModal = false;
    this.selectedProduct = null;
    this.adjustmentQuantity = 0;
    this.adjustmentNotes = '';
  }

  submitAdjustment(): void {
    if (!this.selectedProduct || this.adjustmentQuantity <= 0) {
      this.toastService.error('Invalid Input', 'Please enter a valid quantity');
      return;
    }

    const adjustment: InventoryAdjustment = {
      productId: this.selectedProduct.id!,
      quantity: this.adjustmentQuantity,
      notes: this.adjustmentNotes
    };

    let operation;
    let message = '';

    switch (this.adjustmentType) {
      case 'add':
        operation = this.inventoryService.addStock(adjustment);
        message = `Added ${this.adjustmentQuantity} units to ${this.selectedProduct.name}`;
        break;
      case 'remove':
        operation = this.inventoryService.removeStock(adjustment);
        message = `Removed ${this.adjustmentQuantity} units from ${this.selectedProduct.name}`;
        break;
      case 'adjust':
        operation = this.inventoryService.adjustStock(
          this.selectedProduct.id!,
          this.adjustmentQuantity,
          this.adjustmentNotes
        );
        message = `Adjusted ${this.selectedProduct.name} quantity to ${this.adjustmentQuantity}`;
        break;
    }

    const sub = operation.subscribe({
      next: () => {
        this.toastService.success('Success', message);
        this.closeAdjustmentModal();
        this.loadProducts();
      },
      error: (error) => {
        this.toastService.error('Error', error.error || 'Failed to adjust inventory');
        console.error('Adjustment error:', error);
      }
    });

    this.subscriptions.push(sub);
  }

  getStockStatusClass(product: Product): string {
    return product.lowStock ? 'low-stock-badge' : 'stock-ok-badge';
  }

  getStockStatusText(product: Product): string {
    return product.lowStock ? 'Low Stock' : 'In Stock';
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) return 'minus';
    return this.sortDirection === 'asc' ? 'chevron-up' : 'chevron-down';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 3);
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
