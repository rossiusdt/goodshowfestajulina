import { Zap, Star, Wine } from 'lucide-react';

export default function SectorInfo() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Setores</h2>

      <div className="space-y-6">
        {/* SETOR PISTÃO */}
        <div className="border-2 border-blue-500 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">SETOR PISTÃO</h3>
          </div>

          <p className="text-lg font-semibold text-blue-700 mb-3">
            O setor mais democrático e energético do evento — perfeito para quem quer curtir intensamente e ainda aproveitar uma vantagem imperdível.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Aqui a vibe é lá em cima, com acesso à pista para viver cada momento de perto, cantar, dançar e sentir toda a energia do show junto da galera.
          </p>

          <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 rounded-lg p-5 mb-4">
            <p className="text-xl font-bold text-orange-700 mb-2">🔥 INGRESSO DUPLO EXCLUSIVO:</p>
            <p className="text-gray-800 font-semibold leading-relaxed">
              Comprou 1, levou 2! Isso mesmo — você garante sua entrada e ainda leva um acompanhante sem pagar nada a mais.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Chame quem você quiser e venha viver essa experiência com o dobro de emoção pagando apenas um ingresso.
          </p>
        </div>

        {/* SETOR BACKSTAGE */}
        <div className="border-2 border-purple-500 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">SETOR BACKSTAGE</h3>
          </div>

          <p className="text-lg font-semibold text-purple-700 mb-3">
            A experiência mais exclusiva e imersiva do evento, feita para quem quer estar onde tudo acontece.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            No Backstage, você fica atrás dos DJs, vivendo o evento de um ângulo único, colado nos artistas e sentindo de perto toda a energia da apresentação.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Você ainda garante um Meet & Greet exclusivo, com acesso privilegiado para interagir e registrar momentos inesquecíveis.
          </p>

          <div className="bg-white/50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-900 mb-3">🎁 Benefícios exclusivos:</p>
            <ul className="text-gray-700 space-y-1 mb-4">
              <li>• Camisa oficial do evento</li>
              <li>• Copo exclusivo personalizado</li>
            </ul>

            <p className="font-semibold text-gray-900 mb-2">🍹 Open Bar completo:</p>
            <p className="text-gray-700">
              Uma seleção das mais variadas bebidas alcoólicas e não alcoólicas, para você curtir sem limites do início ao fim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
