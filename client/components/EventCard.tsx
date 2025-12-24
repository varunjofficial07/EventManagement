import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  availableSeats: number;
  image: string;
  price?: number;
}

export default function EventCard({
  id,
  title,
  date,
  time,
  location,
  availableSeats,
  image,
  price,
}: EventCardProps) {
  return (
    <Link to={`/event/${id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-accent-50">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {availableSeats <= 5 && availableSeats > 0 && (
            <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
              {availableSeats} seats left
            </div>
          )}
          {availableSeats === 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Sold Out
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>

          {/* Info Grid */}
          <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4 flex-shrink-0 text-primary-600" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4 flex-shrink-0 text-primary-600" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0 text-primary-600" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4 flex-shrink-0 text-primary-600" />
              <span>{availableSeats} seats available</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {price && (
              <span className="font-bold text-lg text-primary-600">
                ${price}
              </span>
            )}
            <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary text-white rounded-lg font-medium text-sm hover:shadow-lg hover:from-primary-700 transition-all">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
