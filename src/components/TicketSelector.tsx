import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

interface TicketOption {
  id: string;
  name: string;
  price: number;
  label: string;
  note?: string;
}

const ticketOptions: TicketOption[] = [
  {
    id: 'pista-promo',
    name: 'Pista Promocional',
    price: 70.00,
    label: 'R$ 70,00',
  },
  {
    id: 'pista-duplo',
    name: 'Pista (2 Amigos)',
    price: 120.00,
    label: 'R$ 120,00',
    note: 'O setor inclui 02 ingressos. Cada ingresso é válido para 01 pessoa.',
  },
  {
    id: 'pista-premium-promo',
    name: 'Pista Premium Promocional',
    price: 100.00,
    label: 'R$ 100,00',
  },
  {
    id: 'pista-premium-duplo',
    name: 'Pista Premium (2 Amigos)',
    price: 170.00,
    label: 'R$ 170,00',
    note: 'O setor inclui 02 ingressos. Cada ingresso é válido para 01 pessoa.',
  },
];

const initialQuantities = Object.fromEntries(ticketOptions.map(t => [t.id, 0]));

export default function TicketSelector() {
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);
  const [modalOpen, setModalOpen] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const selectedSummary = ticketOptions
    .filter(t => quantities[t.id] > 0)
    .map(t => `${quantities[t.id]}x ${t.name} (${t.label})`)
    .join(' + ');

  const totalAmount = ticketOptions.reduce(
    (sum, t) => sum + Math.round(t.price * 100) * quantities[t.id],
    0
  );

  const pixItems = ticketOptions
    .filter(t => quantities[t.id] > 0)
    .map(t => ({
      title: t.name,
      unitPrice: Math.round(t.price * 100),
      quantity: quantities[t.id],
    }));

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
        <p className="text-gray-700 font-medium mb-6">Escolha uma opção</p>

        <div className="space-y-3 mb-6">
          {ticketOptions.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="mb-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{ticket.name}</h3>
                <p className="text-lg font-bold text-gray-900">{ticket.label}</p>
                {ticket.note && (
                  <p className="text-xs text-gray-500 mt-1">{ticket.note}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(ticket.id, -1)}
                  disabled={quantities[ticket.id] === 0}
                  className="w-9 h-9 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-700" />
                </button>
                <span className="w-10 text-center font-semibold text-gray-900">{quantities[ticket.id]}</span>
                <button
                  onClick={() => updateQuantity(ticket.id, 1)}
                  className="w-9 h-9 rounded-md bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          disabled={totalTickets === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors"
        >
          {totalTickets > 0 ? 'Finalizar Compra' : 'Selecione um Ingresso'}
        </button>
      </div>

      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedSummary={selectedSummary}
        items={pixItems}
        totalAmount={totalAmount}
      />
    </>
  );
}
