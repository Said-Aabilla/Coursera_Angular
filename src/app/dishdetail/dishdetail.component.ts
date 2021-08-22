import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { baseURL } from '../shared/baseurl';
//animation
import { visibility , expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(),
    expand()
  ],
})
export class DishdetailComponent implements OnInit {

  dish!: Dish;
  dishIds!: string[];
  prev!: string;
  next!: string;
  dishcopy!: Dish;
  errMess: any;
  comment!: Comment;
  commentForm!: FormGroup;
  BaseURL = baseURL;
  visibility = 'shown';

  formErrors: any = {
    'name': '',
    'comment': ''
  };

  validationMessages: any = {
    'name': {
      'required': ' Name is required.',
      'minlength': ' Name must be at least 2 characters long.',
      'maxlength': ' Name cannot be more than 25 characters long.'
    },
    'coment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 10 characters long.',
    },
  };

  @ViewChild('fform')
  commentFormDirective!: { resetForm: () => void; };



  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm() {
    this.commentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy).subscribe(
      dish => {
        this.dish = dish;
        this.dishcopy = dish
      },
      errmess => {
        this.dish = null as any;
        this.dishcopy = null as any;
        this.errMess = <any>errmess;
      }
    );

    this.commentForm.reset({
      name: '',
      rating: 5,
      comment: '',
    });
    this.commentFormDirective.resetForm();
  }


  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';

        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';

            }
          }
        }
      }
    }
  }
}
