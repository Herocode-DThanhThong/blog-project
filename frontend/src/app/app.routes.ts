import { Routes } from '@angular/router';
import { BlogDetailComponent } from './component/blog-detail/blog-detail.component';
import { CreateBlogComponent } from './component/create-blog/create-blog.component';
import { HomeComponent } from './component/home/home.component';
import { LoginAdminComponent } from './component/login-admin/login-admin.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { UserInfoComponent } from './component/user-info/user-info.component';
import { VerifyAccountResultComponent } from './component/verify-account-result/verify-account-result.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { YourRequestComponent } from './component/your-request/your-request.component';
import { AboutComponent } from './component/about/about.component';
import { IntroductionComponent } from './component/introduction/introduction.component';
import { UserGuard } from './guards/user.guard';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './component/admin/layout/layout.component';
import { UserComponent } from './component/admin/user/user.component';
import { BlogComponent } from './component/admin/blog/blog.component';
import { RoleRequestComponent } from './component/admin/role-request/role-request.component';
import { AdminGuard } from './guards/admin.guard';
import { BlogDetailAdminComponent } from './component/admin/blog-detail-admin/blog-detail-admin.component';
import { MyBlogComponent } from './component/my-blog/my-blog.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [UserGuard] },
  {
    path: 'create-blog',
    component: CreateBlogComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'blog-detail/:id',
    component: BlogDetailComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login/admin',
    component: LoginAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verify-account-result',
    component: VerifyAccountResultComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'your-request',
    component: YourRequestComponent,
    canActivate: [UserGuard],
  },
  { path: 'about', component: AboutComponent, canActivate: [UserGuard] },
  {
    path: 'introduction',
    component: IntroductionComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'my-blog',
    component: MyBlogComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'blog',
        component: BlogComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'blog/:id',
        component: BlogDetailAdminComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'role-request',
        component: RoleRequestComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
];
