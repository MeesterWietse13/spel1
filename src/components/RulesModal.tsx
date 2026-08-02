import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, X, ShieldAlert, CheckCircle2, RotateCw, Target, Trophy } from 'lucide-react';
import { Sphere } from './Sphere';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, id = 'rules-modal' }) => {
  if (!isOpen) return null;

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl text-white my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide">
                Spelregels van Rolit
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Hoe speel je het officiële Rolit bordspel op tablet?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 my-5 overflow-y-auto pr-2 text-slate-300 text-sm leading-relaxed">
          {/* Rule 1: Goal */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex gap-3.5 items-start">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">1. Het Speldoel</h3>
              <p>
                Het doel van Rolit is om aan het einde van het spel (wanneer het bord met 64 ballen vol is) de <strong className="text-amber-300">meeste ballen van jouw kleur</strong> te bezitten!
              </p>
            </div>
          </div>

          {/* Rule 2: Start Setup */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex gap-3.5 items-start">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0 mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">2. Startopstelling</h3>
              <p className="mb-2">
                Het spel begint in het midden van het 8x8 bord met 4 ballen (één van elke kleur):
              </p>
              <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-700/80 w-fit">
                <Sphere color="red" sizeClassName="w-6 h-6" />
                <Sphere color="yellow" sizeClassName="w-6 h-6" />
                <Sphere color="blue" sizeClassName="w-6 h-6" />
                <Sphere color="green" sizeClassName="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Rule 3: Placing & Capturing */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex gap-3.5 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">3. Ballen Insluiten & Rolen</h3>
              <p className="mb-2">
                Je legt om de beurt een bal op een leeg vakje dat grenst aan een al aanwezige bal op het bord.
              </p>
              <p>
                Wanneer je een bal legt, worden alle ballen van tegenstanders die in een <strong className="text-emerald-300">rechte lijn (horizontaal, verticaal of diagonaal)</strong> ingesloten liggen tussen jouw nieuwe bal en een bestaande bal van jouw kleur, omgerold naar jouw kleur!
              </p>
            </div>
          </div>

          {/* Rule 4: Mandatory Capture */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex gap-3.5 items-start">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-300 text-base mb-1">4. Verplichte Insluiting</h3>
              <p>
                In Rolit geldt de regel: <strong className="text-white">Insluiten is verplicht!</strong> Als er op het bord zetmogelijkheden zijn waarmee je ten minste 1 bal van een tegenstander kunt rolen, moet je één van die insluitende zetten kiezen.
              </p>
              <p className="mt-1 text-slate-400 text-xs">
                (Pas als er helemaal geen insluitende zet mogelijk is, mag je op een willekeurig aangrenzend vrij vakje leggen).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            Begrepen!
          </button>
        </div>
      </motion.div>
    </div>
  );
};
