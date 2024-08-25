import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { ConfirmotpComponent } from './component/confirmotp/confirmotp.component';
import { RegisterComponent } from './component/register/register.component';
import { ForgetpasswordComponent } from './component/forgetpassword/forgetpassword.component';
import { UpdatepasswordComponent } from './component/updatepassword/updatepassword.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import { UserComponent } from './component/user/user.component';
import { authGuard } from './_guard/auth.guard';
import { UserroleComponent } from './component/userrole/userrole.component';
import { RiverComponent } from './component/river/river.component';
import { AddriverComponent } from './component/addriver/addriver.component';
import { RiverstationComponent } from './component/riverstation/riverstation.component';
import { AddriverstationComponent } from './component/addriverstation/addriverstation.component';
import { PredictResultComponent } from './component/predict-result/predict-result.component';

export const routes: Routes = [
    {path:'',component:HomeComponent,canActivate:[authGuard]},
    
    {path:'login',component:LoginComponent},
    {path:'confirmotp',component:ConfirmotpComponent},
    {path:'forgetpassword',component:ForgetpasswordComponent},
    {path:'updatepassword',component:UpdatepasswordComponent},
    {path:'user/resetpassword',component:ResetpasswordComponent},
    {path:'user',component:UserComponent,canActivate:[authGuard]},
    {path:'userrole',component:UserroleComponent,canActivate:[authGuard]},
    {path: 'river', component:RiverComponent,canActivate:[authGuard]},
    {path:'river/add',component:AddriverComponent,canActivate:[authGuard]},
    {path:'river/edit/:id',component:AddriverComponent,canActivate:[authGuard]},
    {path: 'riverstation', component:RiverstationComponent,canActivate:[authGuard]},
    {path:'riverstation/add',component:AddriverstationComponent,canActivate:[authGuard]},
    {path:'riverstation/edit/:id',component:AddriverstationComponent,canActivate:[authGuard]},
    {path:'predictResult',component:PredictResultComponent,canActivate:[authGuard]},
    {path:'user/register',component:RegisterComponent},
];
