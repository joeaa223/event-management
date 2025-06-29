import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
    standalone: false
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postsSub: Subscription | undefined;

    constructor(public postsService: PostsService) {}

    ngOnInit() {
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostsUpdateListener()
            .subscribe((posts: Post[]) => {
                this.posts = posts;
            });
    }

    ngOnDestroy() {
        this.postsSub?.unsubscribe();
    }
} 