import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';

export const instant = false;

const PASTEL_COLORS = [
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-pink-100',
  'bg-purple-100',
  'bg-orange-100'
];

import { GraduationCap, Star, StarHalf } from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  if (!rating) return null;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <div className="flex items-center gap-0.5 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 fill-current" />)}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-current" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
      <span className="text-gray-600 text-xs ml-1 font-bold">{rating}/5</span>
    </div>
  );
}

export default async function Home(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await connection();
  const searchParams = await props.searchParams;
  const serie = searchParams?.serie as string | undefined;

  const supabase = await createClient();
  let query = supabase.from('concours').select('*').order('created_at', { ascending: false });
  
  if (serie) {
    query = query.contains('target_series', [serie]);
  }

  const { data: concoursList, error } = await query;

  const availableSeries = ['S1', 'S2', 'S3', 'L1a', 'L1b', 'L2', 'STEG', 'T1', 'T2'];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-pink-100 p-2 rounded-xl group-hover:bg-pink-200 transition-colors">
              <GraduationCap className="w-6 h-6 text-pink-600" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-[family-name:var(--font-outfit)] font-black tracking-tight text-gray-900">
              Concours<span className="text-pink-600">SN</span>
            </span>
          </Link>
          <nav>
            <ul className="flex gap-4 items-center">
              <li>
                <Link href="/forum" className="text-gray-600 font-bold hover:text-pink-600 transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/contribuer" className="bg-pink-100 text-pink-700 font-bold px-4 py-2.5 rounded-xl hover:bg-pink-200 transition-colors flex items-center gap-2">
                  Contribuer
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 md:px-8 py-8">
        {/* Playful Hero Section */}
        <section className="mb-16 bg-pink-100 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Prenez votre <br/>
              <span className="text-pink-600">Avenir</span> en main
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-lg mb-8 font-medium leading-relaxed">
              Retrouvez toutes les dates, conditions et modalités d'inscription pour les grandes écoles (EPT, ESP, ENSTP, UGB...) au Sénégal.
            </p>
            
            {/* Filter */}
            <form method="GET" className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl shadow-sm max-w-md border border-pink-50">
              <div className="flex-grow">
                <select 
                  name="serie" 
                  id="serie" 
                  defaultValue={serie || ''} 
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-gray-700 font-medium px-2 py-1 cursor-pointer"
                >
                  <option value="">Quelle est votre série ?</option>
                  {availableSeries.map(s => (
                    <option key={s} value={s}>Série {s}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-700 transition-transform active:scale-95 shadow-md">
                Trouver
              </button>
            </form>
          </div>

          <div className="md:w-1/2 flex justify-center">
             <Image 
               src="/hero-illustration.svg" 
               alt="Étudiant regardant vers l'avenir" 
               width={500} 
               height={400} 
               className="w-full max-w-md"
               priority
             />
          </div>
        </section>

        {/* Concours Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {serie ? `Concours ouverts pour la série ${serie}` : "Tous les concours"}
            </h3>
          </div>

          {error && (
            <p className="text-red-500 bg-red-50 p-4 rounded-xl font-medium">Erreur de chargement: {error.message}</p>
          )}

          {!error && (!concoursList || concoursList.length === 0) && (
            <div className="text-center p-16 bg-gray-50 rounded-[2rem] border border-gray-100">
              <p className="text-xl text-gray-500 font-medium">Aucun concours ne correspond à ce filtre pour le moment.</p>
              {serie && (
                <Link href="/" className="inline-block mt-4 text-pink-600 font-bold hover:underline">
                  Voir tous les concours
                </Link>
              )}
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {concoursList && concoursList.map((concours, index) => {
              const bgColorClass = PASTEL_COLORS[index % PASTEL_COLORS.length];
              
              return (
                <div key={concours.id} className={`${bgColorClass} rounded-[2rem] p-2 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group`}>
                  <div className="bg-white rounded-[1.75rem] p-2 flex flex-col flex-grow h-full relative overflow-hidden">
                    
                    {/* Photo du concours */}
                    {concours.photo ? (
                      <div className="relative w-full h-40 bg-gray-100 rounded-[1.25rem] overflow-hidden mb-4">
                        <Image 
                          src={concours.photo.startsWith('http') ? concours.photo : `https://gjfcciqfljsgkdbdsoyr.supabase.co/storage/v1/object/public/photos/${concours.photo}`} 
                          alt={concours.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-12 bg-transparent mb-2"></div>
                    )}

                    <div className="px-4 pb-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-gray-900 leading-tight pr-14">{concours.title}</h3>
                        {concours.acronym && (
                          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm z-10">
                            {concours.acronym}
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <StarRating rating={concours.reputation} />
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-5 flex-grow line-clamp-2">
                        {concours.description}
                      </p>
                      
                      {concours.target_series && concours.target_series.length > 0 && (
                        <div className="mb-5 flex flex-wrap gap-1.5">
                          {concours.target_series.map((s: string) => (
                            <span key={s} className="bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-sm font-medium mb-6 bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-gray-700">
                          <span className="text-lg bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">⏳</span> 
                          <span><span className="text-gray-400 text-xs block leading-none mb-1">Limite</span> {concours.registration_deadline ? new Date(concours.registration_deadline).toLocaleDateString('fr-FR') : 'NC'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <span className="text-lg bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">📅</span> 
                          <span><span className="text-gray-400 text-xs block leading-none mb-1">Épreuves</span> {concours.exam_date ? new Date(concours.exam_date).toLocaleDateString('fr-FR') : 'NC'}</span>
                        </div>
                      </div>
                      
                      <Link href={`/concours/${concours.id}`} className="bg-gray-900 text-white text-center py-3.5 rounded-xl hover:bg-gray-800 transition-colors font-bold w-full block mt-auto">
                        Découvrir
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="mt-20 py-8 text-center text-sm text-gray-400 font-medium">
        <p>© 2026 Concours SN. Conçu pour les élèves de Terminale.</p>
      </footer>
    </div>
  );
}
