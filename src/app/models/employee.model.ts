export class Employee {
  id?: number = 0;
  firstname: string = '';
  lastname: string = '';
  birthdate: string = '';
  gender: string = '';
  email:string=  '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  phone:string='';
  education: string = '';
  institute: string = '';
  startDate: string = '';
  endDate: string = '';
  grade: number = 0;
  profile: string = '';
}
