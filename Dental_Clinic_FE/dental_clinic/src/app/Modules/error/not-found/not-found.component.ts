import { Component, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class NotFoundComponent implements AfterViewInit {
  @ViewChild('burger') burger!: ElementRef; // Tham chiếu đến nút burger
  @ViewChild('nav') nav!: ElementRef;       // Tham chiếu đến nav

  ngAfterViewInit(): void {
    // GSAP Animations
    gsap.set('svg', { visibility: 'visible' });
    gsap.to('#headStripe', {
      y: 0.5,
      rotation: 1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      duration: 1
    });
    gsap.to('#spaceman', {
      y: 0.5,
      rotation: 1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      duration: 1
    });
    gsap.to('#craterSmall', {
      x: -3,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: 'sine.inOut'
    });
    gsap.to('#craterBig', {
      x: 3,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: 'sine.inOut'
    });
    gsap.to('#planet', {
      rotation: -2,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%'
    });

    gsap.to('#starsBig g', {
      rotation: 'random(-30,30)',
      transformOrigin: '50% 50%',
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
    gsap.fromTo(
      '#starsSmall g',
      { scale: 0, transformOrigin: '50% 50%' },
      { scale: 1, transformOrigin: '50% 50%', yoyo: true, repeat: -1, stagger: 0.1 }
    );
    gsap.to('#circlesSmall circle', {
      y: -4,
      yoyo: true,
      duration: 1,
      ease: 'sine.inOut',
      repeat: -1
    });
    gsap.to('#circlesBig circle', {
      y: -2,
      yoyo: true,
      duration: 1,
      ease: 'sine.inOut',
      repeat: -1
    });

    gsap.set('#glassShine', { x: -68 });

    gsap.to('#glassShine', {
      x: 80,
      duration: 2,
      rotation: -30,
      ease: 'expo.inOut',
      transformOrigin: '50% 50%',
      repeat: -1,
      repeatDelay: 8,
      delay: 2
    });

    // Burger Menu Toggle
    const burgerElement = this.burger.nativeElement;
    const navElement = this.nav.nativeElement;

    burgerElement.addEventListener('click', () => {
      const burgerState = burgerElement.dataset.state;
      const navState = navElement.dataset.state;

      burgerElement.dataset.state = burgerState === 'closed' ? 'open' : 'closed';
      navElement.dataset.state = navState === 'closed' ? 'open' : 'closed';
    });
  }
}
