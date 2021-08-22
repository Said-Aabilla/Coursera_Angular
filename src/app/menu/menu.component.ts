import { Component, OnInit ,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  
  dishes!: Dish[] ;
  BaseURL = this.baseURL;
  errMess!: string;

  constructor(private dishService: DishService, @Inject('baseURL') private baseURL: any) {
   }

  ngOnInit(): void {    
    this.dishService.getDishes()
      .subscribe(dishes => this.dishes = dishes,
        errmess => this.errMess = <any>errmess);  }

}