import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;
  title = 'EmployeeCRUD';

  employeeForm: FormGroup;

  employees: Employee[];
  employeesToDisplay: Employee[];
  educationOptions = [
    'SSC',
    'HSC',
    'Graduation',
    'Post Graduation'
  ];

  editFlag=false;
  educationArray=[{}];
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = fb.group({});
    this.employees = [];
    this.employeesToDisplay = this.employees;
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstname: new FormControl("" , [Validators.required,Validators.pattern("[a-zA-Z].*") ,Validators.minLength(2)]),
      lastname : new FormControl("",[Validators.required,Validators.pattern("[a-zA-Z].*"),Validators.minLength(2)]),
      email: new FormControl("",[Validators.required,Validators.email]),
      phone: new FormControl("",[Validators.required,Validators.pattern("[0-9]*") ,Validators.minLength(11),Validators.maxLength(11)]),
      birthday: this.fb.control(''),

      gender : new FormControl("",Validators.required),
      education: this.fb.control(''),
      institute: this.fb.control(''),
      startDate: this.fb.control(''),
      endDate: this.fb.control(''),

      grade: this.fb.control(''),
    });

    this.employeeService.getEmployees().subscribe((res) => {
      for (let emp of res) {
        this.employees.unshift(emp);
      }
      this.employeesToDisplay = this.employees;
    });
  }

  ngAfterViewInit(): void {
    //this.buttontemp.nativeElement.click();
  }

  addEducation() {
console.log("Educated");
this.educationArray.pop();
this.educationArray.push({
  education: this.Education.value,
  institute: this.Institute.value,
  startDate: this.StartDate.value,
  endDate: this.EndDate.value,
  grade: this.Grade.value
});
this.educationArray.push({})
  }

  addEmployee() {
    if(!this.editFlag){
    this.educationArray.pop();
    this.educationArray.push({
      education: this.Education.value,
      institute: this.Institute.value,
      startDate: this.StartDate.value,
      endDate: this.EndDate.value,
      grade: this.Grade.value
    });}

    this.editFlag=false;

    let employee: any = {
      firstname: this.FirstName.value,
      lastname: this.LastName.value,
      birthdate: this.BirthDay.value,
      gender: this.Gender.value,
      email:this.Email.value,
      phone:this.Phone.value,
      education: this.educationArray,
      // institute: this.Institute.value,
      // startDate: this.StartDate.value,
      // endDate: this.EndDate.value,
      // grade: this.Grade.value,
      profile: this.fileInput.nativeElement.files[0]?.name,
    };
    this.employeeService.postEmployee(employee).subscribe((res) => {
      this.employees.unshift(res);
      this.clearForm();
    });
  }

  removeEmployee(event: any) {
    this.employees.forEach((val, index) => {
      if (val.id === parseInt(event)) {
        this.employeeService.deleteEmployee(event).subscribe((res) => {
          this.employees.splice(index, 1);
        });
      }
    });
  }

  editEmployee(event: any) {
    this.employees.forEach((val, ind) => {
      if (val.id === event) {
        this.editFlag=true;
        this.setForm(val);
      }
    });
    this.removeEmployee(event);
    this.addEmployeeButton.nativeElement.click();
  }

  setForm(emp: Employee) {
    this.FirstName.setValue(emp.firstname);
    this.LastName.setValue(emp.lastname);
    this.BirthDay.setValue(emp.birthdate);
    this.Gender.setValue(emp.gender);
    this.Email.setValue(emp.email);
    this.Phone.setValue(emp.phone);

    // let educationIndex = 0;
    // this.educationOptions.forEach((val, index) => {
    //   if (val === emp.education) educationIndex = index;
    // });
    this.Education.setValue(emp.education);

    this.Institute.setValue(emp.institute);
    this.StartDate.setValue(emp.startDate);
    this.EndDate.setValue(emp.endDate);

    this.Grade.setValue(emp.grade);
    this.fileInput.nativeElement.value = '';
  }

  searchEmployees(event: any) {
    let filteredEmployees: Employee[] = [];

    if (event === '') {
      this.employeesToDisplay = this.employees;
    } else {
      filteredEmployees = this.employees.filter((val, index) => {
        let targetKey = val.firstname.toLowerCase() + '' + val.lastname.toLowerCase();
        let searchKey = event.toLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeesToDisplay = filteredEmployees;
    }
  }

  clearForm() {
    this.FirstName.setValue('');
    this.LastName.setValue('');
    this.BirthDay.setValue('');
    this.Gender.setValue('');
    this.Email.setValue('');
    this.Phone.setValue('');
    this.Education.setValue('');
    this.Institute.setValue('');
    this.StartDate.setValue('');
    this.EndDate.setValue('');
    this.Grade.setValue('');
    this.fileInput.nativeElement.value = '';
  }

  public get FirstName(): FormControl {
    return this.employeeForm.get('firstname') as FormControl;
  }
  public get LastName(): FormControl {
    return this.employeeForm.get('lastname') as FormControl;
  }
  public get BirthDay(): FormControl {
    return this.employeeForm.get('birthday') as FormControl;
  }
  public get Email(): FormControl {
    return this.employeeForm.get('email') as FormControl;
  }
  public get Phone(): FormControl {
    return this.employeeForm.get('phone') as FormControl;
  }
  public get Gender(): FormControl {
    return this.employeeForm.get('gender') as FormControl;
  }
  public get Education(): FormControl {
    return this.employeeForm.get('education') as FormControl;
  }
  public get Institute(): FormControl {
    return this.employeeForm.get('institute') as FormControl;
  }
  public get StartDate(): FormControl {
    return this.employeeForm.get('startDate') as FormControl;
  }
  public get EndDate(): FormControl {
    return this.employeeForm.get('endDate') as FormControl;
  }
  public get Grade(): FormControl {
    return this.employeeForm.get('grade') as FormControl;
  }
}
