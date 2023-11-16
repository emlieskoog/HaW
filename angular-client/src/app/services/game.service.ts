import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { io } from 'socket.io-client'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket: any

  constructor(private http: HttpClient, private router: Router) { }

  hostGame(): Observable<any> {
    const options = { withCredentials: true }
    return this.http.get(`${environment.apiUrl}/api/game/host`, options)
  }

  hostGameSocketConnect(gameId: string, username: string): void {
    if (!this.socket) {
      this.socket = io(environment.apiUrl)
    }
    this.socket.connect()
    this.socket.emit('hostGame', { gameId, username })
  }

  joinGame(gameId: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/join`, { gameId: gameId }, options)
  }

  joinGameSocketConnect(gameId: string, username: string) {
    if (!this.socket) {
      this.socket = io(environment.apiUrl)
    }
    this.socket.connect()
    this.socket.emit('joinGame', { gameId, username })
  }

  closeLobby(gameId: string): Observable<any> {
    const options = { 
      withCredentials: true,
      body: {
        gameId: gameId,
      }
    }
    return this.http.delete(`${environment.apiUrl}/api/game/close`, options)
  }

  leaveGame(gameId: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/leave`, { gameId: gameId }, options)
  }

  closeLobbySocket(gameId: string, username: string) {
    this.socket.emit('closeLobby', { gameId, username })
  }

  leaveGameSocket(gameId: string, username: string) {
    this.socket.emit('leaveGame', { gameId, username })
    this.socket.disconnect()
  }

  lobbyClosedEvent() {
    this.socket.on('lobbyClosed', (data: any) => {
      const { gameId, username } = data
      console.log(`Host ${username} closed the lobby, disconnecting...`)
      this.socket.disconnect()
      this.router.navigateByUrl('/home')
    })
  }

  playerJoinedEvent() {
    this.socket.on('playerJoined', (data: any) => {
      const { username } = data
      console.log(`User ${username} joined the game!`)
    })
  }

  playerLeftEvent() {
    this.socket.on('playerLeft', (data: any) => {
      const { username } = data
      console.log(`User ${username} left the game!`)
    })
  }
}
