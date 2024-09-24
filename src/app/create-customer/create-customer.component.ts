import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ICustomer } from '../interface/customer';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css',
})
export class CreateCustomerComponent implements OnInit {
  customerFormGroup!: FormGroup;
  pathname!: string;
  id!: number;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.pathname = this.route.snapshot.url[0]?.path ?? '';
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.createCustomerForm(this.customerService.selectedCustomer!);
  }

  createCustomerForm(data: ICustomer) {
    this.customerFormGroup = this.formBuilder.group({
      name: [data ? data.name : '', [Validators.required]],
      email: [data ? data.email : '', [Validators.required, Validators.email]],
      phone: [
        data ? data.phone : '',
        [Validators.required, Validators.minLength(10)],
      ],
      address: [data ? data.address.street : '', [Validators.required]],
    });
  }

  createNewCustomer() {
    // console.log('Hold on');
    const customerData = this.customerFormGroup.value;
    console.log({ customerData });
    this.customerService.createCustomers(customerData).subscribe(
      (response) => {
        console.log(response);

        alert('Customer created successfully!');
        this.dialog.open(DialogComponent, {
          data: response,
        });
        // this.customerFormGroup.reset();
        this.router.navigateByUrl('');
      },
      (err) => {
        alert(err);
      }
    );
  }

  onEdit(): void {
    this.customerFormGroup.value.id = this.id;
    if (this.customerFormGroup.valid) {
      if (typeof this.customerFormGroup.value.address === 'string')
        this.customerFormGroup.value.address = {
          street: this.customerFormGroup.value.address,
        };
      this.customerService
        .editCustomers(this.customerFormGroup.value)
        .subscribe((data) => {
          this.dialog.open(DialogComponent, {
            data: data,
          });
        });
    }
    this.router.navigateByUrl('');
  }
}
