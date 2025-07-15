import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitting = false;
  categories: string[] = [];
  
  // Predefined categories (can be extended)
  predefinedCategories = [
    'Electronics',
    'Office Supplies',
    'Food & Beverages',
    'Clothing',
    'Tools & Hardware',
    'Books & Media',
    'Health & Beauty',
    'Sports & Recreation',
    'Automotive',
    'Home & Garden'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0), Validators.max(999999)]],
      threshold: [1, [Validators.required, Validators.min(1), Validators.max(999999)]]
    });
  }

  
  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = parseInt(id, 10);
      this.loadProduct();
    }
  }

  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = [...new Set([...this.predefinedCategories, ...categories])].sort();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = this.predefinedCategories;
      }
    });
  }

  loadProduct(): void {
    if (!this.productId) return;
    
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          threshold: product.threshold
        });
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error('Error', 'Failed to load product details');
        console.error('Product loading error:', error);
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.submitting) {
      this.submitting = true;
      
      const productData: Product = {
        name: this.productForm.value.name.trim(),
        category: this.productForm.value.category.trim(),
        price: parseFloat(this.productForm.value.price),
        quantity: parseInt(this.productForm.value.quantity, 10),
        threshold: parseInt(this.productForm.value.threshold, 10)
      };

      const operation = this.isEditMode 
        ? this.productService.updateProduct(this.productId!, productData)
        : this.productService.createProduct(productData);

      operation.subscribe({
        next: (response) => {
          this.submitting = false;
          const message = this.isEditMode 
            ? `Product "${response.name}" updated successfully`
            : `Product "${response.name}" created successfully`;
          
          this.toastService.success('Success', message);
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.submitting = false;
          this.toastService.error('Error', this.isEditMode ? 'Failed to update product' : 'Failed to create product');
          console.error('Product save error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  onCategorySelect(category: string): void {
    this.productForm.patchValue({ category });
  }

  addCustomCategory(event: any): void {
    const customCategory = event.target.value.trim();
    if (customCategory && !this.categories.includes(customCategory)) {
      this.categories.push(customCategory);
      this.categories.sort();
      this.productForm.patchValue({ category: customCategory });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Product name',
      category: 'Category',
      price: 'Price',
      quantity: 'Quantity',
      threshold: 'Threshold'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control?.valid && control.touched);
  }

  getStockPreview(): string {
    const quantity = this.productForm.value.quantity;
    const threshold = this.productForm.value.threshold;
    
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= threshold) return 'Low Stock';
    return 'In Stock';
  }

  getStockPreviewClass(): string {
    const quantity = this.productForm.value.quantity;
    const threshold = this.productForm.value.threshold;
    
    if (quantity <= 0) return 'text-danger';
    if (quantity <= threshold) return 'text-warning';
    return 'text-success';
  }
}
