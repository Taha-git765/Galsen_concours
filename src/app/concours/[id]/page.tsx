import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { GraduationCap, Star, StarHalf, FileText, Download } from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  if (!rating) return null;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <div className="flex items-center gap-0.5 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 fill-current" />)}
      {hasHalfStar && <StarHalf className="w-5 h-5 fill-current" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)}
      <span className="text-gray-600 text-sm ml-2 font-bold">{rating}/5 de réputation</span>
    </div>
  );
}

export const instant = false;

export default async function ConcoursDetail({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: concours, error } = await supabase
    .from('concours')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !concours) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      <header className="py-6 px-4 md:px-8 bg-white border-b border-gray-100">
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

      <main className="flex-grow container mx-auto px-4 md:px-8 py-12 max-w-4xl">
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
          {/* Cover Photo */}
          {concours.photo ? (
            <div className="relative w-full h-64 md:h-96 bg-gray-100">
              <Image 
                src={concours.photo.startsWith('http') ? concours.photo : `https://gjfcciqfljsgkdbdsoyr.supabase.co/storage/v1/object/public/photos/${concours.photo}`} 
                alt={concours.title} 
                fill 
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-32 md:h-48 bg-pink-100"></div>
          )}

          <div className="p-8 md:p-12">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{concours.title}</h1>
                {concours.acronym && (
                  <span className="bg-pink-100 text-pink-800 text-sm font-bold px-4 py-1.5 rounded-full">
                    {concours.acronym}
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <StarRating rating={concours.reputation} />
              </div>
              
              {concours.target_series && concours.target_series.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">Séries :</span>
                  {concours.target_series.map((s: string) => (
                    <span key={s} className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                  <span className="text-xl">📅</span> Dates clés
                </h3>
                <ul className="space-y-4">
                  <li className="flex flex-col border-b border-gray-200 pb-3">
                    <span className="text-gray-500 text-sm font-medium mb-1">Date limite d'inscription</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {concours.registration_deadline ? new Date(concours.registration_deadline).toLocaleDateString('fr-FR') : 'Non précisée'}
                    </span>
                  </li>
                  <li className="flex flex-col pt-1">
                    <span className="text-gray-500 text-sm font-medium mb-1">Date des épreuves</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {concours.exam_date ? new Date(concours.exam_date).toLocaleDateString('fr-FR') : 'Non précisée'}
                    </span>
                  </li>
                </ul>
              </div>

              {concours.registration_link && (
                <div className="flex flex-col justify-center items-center bg-pink-50 p-6 rounded-2xl border border-pink-100 text-center">
                  <h3 className="font-bold text-xl mb-2 text-pink-900">Inscriptions ouvertes</h3>
                  <p className="text-sm text-pink-700 mb-6 font-medium">Ne ratez pas la date limite !</p>
                  <a 
                    href={concours.registration_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-pink-600 text-white px-6 py-4 rounded-xl hover:bg-pink-700 transition-transform active:scale-95 font-bold w-full shadow-sm"
                  >
                    S'inscrire maintenant
                  </a>
                </div>
              )}
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Présentation</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed text-lg">
                {concours.description || "Aucune description fournie."}
              </div>
            </div>

            {concours.registration_steps && (
              <div className="mb-12 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Comment s'inscrire ?</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {concours.registration_steps}
                </div>
              </div>
            )}

            {concours.past_exams_urls && concours.past_exams_urls.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-pink-600" />
                  Anciennes épreuves
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {concours.past_exams_urls.map((urlOrFile: string, idx: number) => {
                    // Vérifier s'il s'agit d'un lien web ou d'un fichier du bucket
                    const isExternal = urlOrFile.startsWith('http');
                    
                    // Si c'est un fichier du bucket, on ajoute ?download= pour forcer le téléchargement
                    let fileUrl = isExternal 
                      ? urlOrFile 
                      : `https://gjfcciqfljsgkdbdsoyr.supabase.co/storage/v1/object/public/epreuves/${urlOrFile}?download=`;
                    
                    // On nettoie le nom pour l'affichage (ex: ept/maths.pdf -> maths.pdf)
                    const displayName = isExternal 
                      ? `Lien externe ${idx + 1}` 
                      : urlOrFile.split('/').pop();

                    return (
                      <a 
                        key={idx}
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-pink-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-pink-50 p-2 rounded-lg group-hover:bg-pink-100 transition-colors">
                            <FileText className="w-5 h-5 text-pink-600" />
                          </div>
                          <span className="font-semibold text-gray-700 truncate" title={displayName}>
                            {displayName}
                          </span>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors flex-shrink-0" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-gray-400 font-medium">
        <p>© 2026 Concours SN. Pour les élèves de Terminale au Sénégal.</p>
      </footer>
    </div>
  );
}
