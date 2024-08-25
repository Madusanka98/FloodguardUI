import { Component, DoCheck, OnInit, effect } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { UserService } from '../../_service/user.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { menu } from '../../_model/user.model';

// Sample menu list
const SAMPLE_MENU_LIST = [
  { code: 'userrole', name: 'User Role' },
  { code: 'users', name: 'Users' },
  { code: 'river', name: 'River' },
  { code: 'River Station', name: 'River Station' },
  { code: 'Predict Result', name: 'Predict Result' }
];

@Component({
  selector: 'app-appmenu',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './appmenu.component.html',
  styleUrl: './appmenu.component.css'
})



export class AppmenuComponent implements OnInit, DoCheck {
  
  menulist = SAMPLE_MENU_LIST;  // Replace with your actual menu list

  getIcon(code: string): string {
    //debugger
    switch (code) {
      case 'userrole':
        return 'supervised_user_circle';  // Icon for User Role
      case 'user':
        return 'group';  // Icon for Users
      case 'river':
        return 'water';  // Icon for River
      case 'riverstation':
        return 'place';  // Icon for River Station
      case 'predictResult':
        return 'show_chart';  // Icon for Predict Result
      default:
        return 'help';  // Default icon
    }
  }

  constructor(private service: UserService, private router: Router) {
    effect(() => {
      this.menulist = this.service._menulist();
    })
  }

  //menulist!: menu[]
  Loginuser = ''
  showmenu = false;

  ngOnInit(): void {
    let userrole = localStorage.getItem('userrole') as string;
    this.service.Loadmenubyrole(userrole).subscribe(item => {
      this.menulist = item;
    })


  }

  ngDoCheck(): void {
    this.Loginuser = localStorage.getItem('username') as string;
    this.Setaccess();
  }

  Setaccess() {
    let userrole = localStorage.getItem('userrole');
    let currentUrl = this.router.url;
    if (currentUrl === '/register' || currentUrl === '/login' || currentUrl === '/resetpassword' ||
      currentUrl === '/forgetpassword') {
      this.showmenu = false;
    } else {
      this.showmenu = true;
    }
  }

  

}
