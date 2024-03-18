import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        
            <div className='fled flex-col gap-2'>
            404 Not Found!
            <div><Link to ="/">Ana Sayfaya geri Dön</Link></div>
            </div>
    );
  }
  
  