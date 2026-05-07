import { Coffee, Users } from 'lucide-react';

export default function SectorInfo() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Setores</h2>

      <div className="space-y-6">
        {/* MESA */}
        <div className="border-2 border-[#5c3d20] rounded-lg p-6 bg-gradient-to-br from-[#fdf6ec] to-[#f5e9d0]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#5c3d20] rounded-lg">
              <Users className="w-6 h-6 text-[#f5e9d0]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">MESA (4 A 6 PESSOAS)</h3>
          </div>

          <p className="text-lg font-semibold text-[#5c3d20] mb-3">
            A melhor opção para curtir o evento com conforto ao lado dos amigos e da família.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Reserve sua mesa e garanta um espaço exclusivo para o grupo aproveitar a noite com mais comodidade, sem abrir mão de nenhum momento do espetáculo.
          </p>

          <div className="bg-gradient-to-r from-[#d4a855]/20 to-[#5c3d20]/10 border-2 border-[#d4a855] rounded-lg p-5">
            <p className="text-xl font-bold text-[#5c3d20] mb-2">Open Bar incluso</p>
            <p className="text-gray-800 font-semibold leading-relaxed">
              Toda a bebida incluída do início ao fim da noite — cerveja, drinks, refrigerante e mais.
            </p>
          </div>
        </div>

        {/* OPEN BAR INDIVIDUAL */}
        <div className="border-2 border-[#d4a855] rounded-lg p-6 bg-gradient-to-br from-[#fdf6ec] to-[#fef9ed]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#d4a855] rounded-lg">
              <Coffee className="w-6 h-6 text-[#3b2a1a]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">OPEN BAR INDIVIDUAL</h3>
          </div>

          <p className="text-lg font-semibold text-[#5c3d20] mb-3">
            Ingresso individual com open bar completo para aproveitar a noite sem preocupações.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Venha sozinho ou com quem quiser e aproveite todo o open bar incluso no ingresso. Uma experiência completa com muito show ao vivo.
          </p>

          <div className="bg-white/60 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Incluso no ingresso:</p>
            <ul className="text-gray-700 space-y-1">
              <li>• Open bar completo (alcoólico e não alcoólico)</li>
              <li>• Acesso ao show de Almir Sater e Sérgio Reis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
