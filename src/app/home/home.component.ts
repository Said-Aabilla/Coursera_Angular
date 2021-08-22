import { Component, Inject, OnInit } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { baseURL } from '../shared/baseurl';
import { flyInOut } from '../animations/app.animation';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut()
  ]
})
export class HomeComponent implements OnInit {
  dish!: Dish;
  promotion!: Promotion;
  leader!: Leader;
  BaseURL = baseURL;
  constructor(private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
  ) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish().subscribe(dish => this.dish = dish);
    this.promotionService.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion);
    this.leaderService.getFeaturedLeader().then(leader => this.leader = leader);

  }

}
