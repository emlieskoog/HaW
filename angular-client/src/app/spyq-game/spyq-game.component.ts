import { Component, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';
import { User } from '../room-page/room-page.component';


@Component({
  selector: 'app-spyq-game',
  templateUrl: './spyq-game.component.html',
  styleUrls: ['./spyq-game.component.scss']
})
export class SpyqGameComponent {
  subscriptions: Subscription[] = []


  @Input() data: any;
  @Input() gameId: string = ''
  @Input() username: string = '';
  @Input() users: User[] = [];
  @Input() timeDifference: number = 0;
  @Input() timeDifferenceVote: number = 0;

  votingDone: boolean = false
  isSpy: boolean = false

  constructor(private gameService: GameService, private userService: UserService) {
    this.subscriptions.push(
      this.gameService.votingDoneEvent().subscribe((data: any) => {
        this.votingDone = true
      })
    )
  }

  vote(votedFor: string): void {
    this.subscriptions.push(
      this.userService.spyQVote(this.gameId, this.username, votedFor).subscribe((data: any) => {
        const { message } = data
        if (message === 'spyQVoteSuccessDone') {
          this.gameService.reportSpyQVotingDone(this.gameId)
          console.log('Voting done')
        }
        setTimeout(() => {
          console.log("Voted")
        })
      })
    )
  }
  ngOnInit(): void {
    console.log(this.username)
    console.log(this.data)

    // if (this.users === null) {
    //   this.router.navigate(['/home'], { state: { error: 'Users data not found' } });
    // }

    // if (typeof this.data === 'undefined') {
    //   this.router.navigate(['/home'], { state: { error: 'Username not found' } });
    // }

    if (this.data === 'spy') {
      this.isSpy = true
    }
  }

}
