import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { APIService } from 'src/app/shared/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.scss'],
})
export class LaptopComponent implements OnInit {
  @HostListener('window:beforeunload')
  saveValues() {
    localStorage.setItem('values', JSON.stringify(this.formGroup.value));
  }
  underLineBoolean!: boolean;
  selectedFile = null;
  imgSrc: any = null
  brandList: any;
  cpuList: any; 
  returnedValues: any;
  storageValues: any;
  body: any;
  formGroup!: FormGroup;
  userInfo: any;
  userValues: any;
  myToken = 'af53b3cae2c04d0c557ab5b071642009'
  img:any ;

  constructor(private http: HttpClient, private api: APIService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.userInfo = this.api.getUser()
    this.api.getBrandMethod().subscribe((res) => {
      this.brandList = res.data;
      console.log(this.brandList)
    })
    this.api.getCpuMethod().subscribe((res) => {
      this.cpuList = res.data;
      console.log(this.cpuList)
    })
    this.underLineBoolean = false;
    this.formGroup = new FormGroup({
      laptop_name: new FormControl('', [Validators.required]),
      laptop_image: new FormControl('', [Validators.required]),
      laptop_brand: new FormControl('', [Validators.required]),
      laptop_cpu: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
      laptop_cpu_cores: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
      laptop_cpu_threads: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
      laptop_ram: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
      laptop_type: new FormControl('', [Validators.required]),
      laptop_state: new FormControl('', [Validators.required]),
      laptop_purchase_date: new FormControl('',),
      laptop_price: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]\d*$/)]),

    })
    console.log(this.formGroup)
    this.storageValues = localStorage.getItem('values');
    this.returnedValues = JSON.parse(this.storageValues);
    if (this.returnedValues) {
      this.formGroup.setValue({
        laptop_name: this.returnedValues.laptop_name,
        laptop_image: this.returnedValues.laptop_image,
        laptop_brand: this.returnedValues.laptop_brand,
        laptop_cpu: this.returnedValues.laptop_cpu,
        laptop_cpu_cores: this.returnedValues.laptop_cpu_cores,
        laptop_cpu_threads: this.returnedValues.laptop_cpu_threads,
        laptop_ram: this.returnedValues.laptop_ram,
        laptop_type: this.returnedValues.laptop_type,
        laptop_state: this.returnedValues.laptop_state,
        laptop_purchase_date: this.returnedValues.laptop_purchase_date,
        laptop_price: this.returnedValues.laptop_price,
      });
    }
  }


  onFileSelected(event: any) {
    if(event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imgSrc = reader.result;
      reader.readAsDataURL(file)
      this.img = event.target.files[0]
    }
  }


  onClick(): void {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/formdata')
    this.userInfo = localStorage.getItem('formValues')
    this.userValues = JSON.parse(this.userInfo)
    console.log(this.userValues)
    console.log(this.img)
    const formdata = new FormData()
    formdata.append('name',this.userValues.name)
    formdata.append('surname',this.userValues.surname)
    formdata.append('team_id',this.userValues.team)
    formdata.append('position_id',this.userValues.position)
    formdata.append('phone_number',this.userValues.tel)
    formdata.append('email',this.userValues.email)
    formdata.append('token',`${this.myToken}`)
    formdata.append('laptop_name',this.formGroup.get('laptop_name')?.value)
    formdata.append('laptop_image',this.img)
    formdata.append('laptop_brand_id',this.formGroup.get('laptop_brand')?.value)
    formdata.append('laptop_cpu',this.formGroup.get('laptop_cpu')?.value)
    formdata.append('laptop_cpu_threads',this.formGroup.get('laptop_cpu_threads')?.value)
    formdata.append('laptop_cpu_cores',this.formGroup.get('laptop_cpu_cores')?.value)
    formdata.append('laptop_hard_drive_type',this.formGroup.get('laptop_type')?.value)
    formdata.append('laptop_price',this.formGroup.get('laptop_price')?.value,)
    formdata.append('laptop_ram',this.formGroup.get('laptop_ram')?.value)
    formdata.append('laptop_state',this.formGroup.get('laptop_state')?.value)
    console.log(this.formGroup.value)
    console.log(this.body)

    // console.log(this.body)
    this.http.post('https://pcfy.redberryinternship.ge/api/laptop/create',formdata, { headers: headers}).subscribe(res => {
      console.log(res)
    })
  }

}
