import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChildService } from '../services/child.service';
import { CustomerService } from '../services/customer.service';
import { ICustomer, ICustomers } from '../interface/customer';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  searchControl = new FormControl();
  displayedColumns: string[] = ['no', 'name', 'email', 'address', 'gender'];
  dataSource!: ICustomers;
  filteredDataSource!: ICustomers;

  constructor(
    private router: Router,
    private childService: ChildService,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.onGetCustomer();
  }

  // customer: string = 'Yemisi';

  goTo() {
    this.router.navigateByUrl('/new-customer');
  }

  myName!: string;

  message: string = 'Got this message from customer component';

  getName($event: string) {
    this.myName = $event;
  }

  sendName() {
    this.childService.setName('New name is Django');
  }

  onGetCustomer() {
    this.customerService.getCustomers().subscribe((data) => {
      this.searchControl.valueChanges.subscribe((searchTerm) => {
        this.filterCustomers(searchTerm);
      });
      this.dataSource = data;
      this.filteredDataSource = [...data];
    });
  }

  filterCustomers(searchTerm: string) {
    if (searchTerm) {
      this.filteredDataSource = this.dataSource.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredDataSource = this.dataSource;
    }
  }

  // Assignments / Project
  viewMoreInfo(element: ICustomer): void {
    this.dialog.open(DialogComponent, {
      data: element,
    });
  }

  goToEdit(element: ICustomer, id: number): void {
    this.customerService.selectedCustomer = element;
    this.router.navigateByUrl(`/edit-customer/${id}`);
  }

  initDelete(rowIndex: number): void {
    const customerId = this.filteredDataSource[rowIndex].id;
    if (customerId) {
      console.log(customerId);
      this.customerService.deleteCustomers(customerId).subscribe((data) => {
        this.filteredDataSource = this.filteredDataSource.filter(
          (item) => item.id !== customerId
        );
        this.dataSource = this.filteredDataSource;
        this.changeDetectorRef.detectChanges(); // Force change detection immediately
      });
    }
  }
}
