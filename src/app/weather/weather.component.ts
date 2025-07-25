import { Component, OnInit } from '@angular/core';
import { WeatherService, WeatherData } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  weatherData: WeatherData | null = null;
  loading = false;
  error = '';
  city = 'London'; // Default city
  Math = Math; // Make Math available in template

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather(): void {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name';
      return;
    }

    this.loading = true;
    this.error = '';

    this.weatherService.getCurrentWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'City not found or API error. Please try again.';
        this.loading = false;
        console.error('Weather API Error:', err);
      }
    });
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          this.loading = true;
          this.error = '';
          
          this.weatherService.getWeatherByCoords(lat, lon).subscribe({
            next: (data) => {
              this.weatherData = data;
              this.city = data.name;
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Unable to get weather for your location.';
              this.loading = false;
              console.error('Weather API Error:', err);
            }
          });
        },
        (error) => {
          this.error = 'Unable to get your location. Please enter a city manually.';
          console.error('Geolocation Error:', error);
        }
      );
    } else {
      this.error = 'Geolocation is not supported by this browser.';
    }
  }
} 