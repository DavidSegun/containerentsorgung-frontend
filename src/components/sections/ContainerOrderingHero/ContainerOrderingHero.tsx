"use client"

import { Button } from "@/components/atoms"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { getZoneFromPostalCode } from "@/lib/helpers/postal-code-zones"
import { getZoneTagIdFromPostalCode } from "@/lib/data/tags"
import { toast } from "@/lib/helpers/toast"

export const ContainerOrderingHero = () => {
  const router = useRouter()
  const params = useParams() as { locale?: string }
  const locale = params?.locale || ""

  const [zipCode, setZipCode] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!zipCode.trim()) {
      toast.error({
        title: "PLZ erforderlich",
        description: "Bitte geben Sie eine Postleitzahl ein",
      })
      return
    }

    setIsSearching(true)

    try {
      // Get zone info from postal code
      const zone = getZoneFromPostalCode(zipCode)
      
      if (!zone) {
        toast.error({
          title: "Ungültige PLZ",
          description: "Bitte geben Sie eine gültige deutsche Postleitzahl ein",
        })
        setIsSearching(false)
        return
      }

      // Route to zone page
      router.push(`/${locale}/versandzonen/${zone.tagName}`)
    } catch (error) {
      console.error("Error finding zone:", error)
      toast.error({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
    <section className="min-h-[screen/2] flex flex-col lg:flex-row">
      <div className="w-full lg:w-2/5 bg-gradient-to-b from-gray-50 to-gray-100 relative flex items-end justify-center py-16 lg:py-0">
        <div className="relative mb-8">
          <svg width="280" height="180" viewBox="0 0 300 200" className="drop-shadow-lg max-w-full h-auto">
            <rect x="50" y="120" width="200" height="60" fill="#9CA3AF" stroke="#000" strokeWidth="2" />
            <rect x="50" y="80" width="200" height="40" fill="#6B7280" stroke="#000" strokeWidth="2" />
            <polygon points="50,80 70,60 230,60 250,80" fill="#4B5563" stroke="#000" strokeWidth="2" />
            <rect x="60" y="70" width="180" height="10" fill="#374151" stroke="#000" strokeWidth="1" />
            <line x1="100" y1="80" x2="100" y2="180" stroke="#000" strokeWidth="2" />
            <line x1="150" y1="80" x2="150" y2="180" stroke="#000" strokeWidth="2" />
            <line x1="200" y1="80" x2="200" y2="180" stroke="#000" strokeWidth="2" />
            <rect x="0" y="180" width="300" height="20" fill="#1F2937" />
          </svg>
        </div>
      </div>
      <div className="w-full lg:w-3/5 bg-slate-800 text-white flex flex-col justify-start px-6 lg:px-12 py-16 lg:py-12">
        <div className="max-w-lg mx-auto lg:mx-0">
          <h1 className="text-xl lg:text-2xl font-bold mb-6 leading-tight">Container bestellen für Bauschutt, Baumischabfall, Altholz, Gartenabfälle, Erdaushub, Gipsabfälle und andere Abfallarten</h1>
          <h2 className="text-lg lg:text-lg text-yellow-400 mb-2 font-bold">Wohin soll geliefert werden?</h2>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row">
              <input 
                type="text" 
                placeholder="PLZ der Lieferadresse" 
                value={zipCode} 
                onChange={(e) => setZipCode(e.target.value)} 
                className="flex-1 bg-white text-gray-900 placeholder-gray-500 py-4 px-6 border-0 focus:outline-none text-lg font-medium mb-2 sm:mb-0" 
                required 
                disabled={isSearching}
              />
              <Button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black font-bold py-4 px-8 text-lg transition-colors flex items-center justify-center rounded-none"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SUCHEN...
                  </>
                ) : (
                  'SUCHEN'
                )}
              </Button>
            </div>
          </form>
          <div className="text-base text-gray-300 leading-relaxed">
            <p className="mb-2">Bitte geben Sie die <span className="font-bold">PLZ der Lieferadresse</span> ein, um alle</p>
            <p className="mb-2">Service- und Preisinformationen abzurufen. Die</p>
            <p>Leistungen und Preise können regional variieren.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Main Content Section */}
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Inhaltsverzeichnis</h3>
              <nav className="space-y-2">
                <a href="#why-order" className="block text-sm text-gray-600 hover:text-yellow-500 transition-colors underline">Warum auf containerentsorgung.shop einen Container bestellen?</a>
                <a href="#container-types" className="block text-sm text-gray-600 hover:text-yellow-500 transition-colors underline">Welche Containerarten gibt es?</a>
                <a href="#checklists" className="block text-sm text-gray-600 hover:text-yellow-500 transition-colors underline">Checklisten: Wofür kann ich die Container einsetzen?</a>
                <a href="#selection" className="block text-sm text-gray-600 hover:text-yellow-500 transition-colors underline">Was muss ich bei der Container-Auswahl beachten?</a>
                <a href="#placement" className="block text-sm text-gray-600 hover:text-yellow-500 transition-colors underline">Wo darf ein Container aufgestellt werden?</a>
                <a href="#waste-types" className="block text-sm text-gray-600 hover:text-yellow-500 transition-colors underline">Welche Abfallarten gibt es und was darf in den Container rein?</a>
                <a href="#disposal" className="block text-sm text-gray-600 hover:text-yellow-500 transition-colors underline">Entsorgung für Ihr Projekt: Container bestellen als Lösung</a>
                <a href="#pickup" className="block text-sm text-gray-600 hover:text-yellow-500 transition-colors underline">Container ist voll, und was ist mit der Abholung?</a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Containerbestellung: Entsorgung schnell und unkompliziert mit nur wenigen Klicks</h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Sie planen ein Bauprojekt oder Gartenarbeiten, bei denen eine größere Menge an Material für die Entsorgung anfallen wird? Sie möchten schnellstmöglich eine unkomplizierte Lösung herbeiführen, auf die Sie sich verlassen können? Dann sind Sie bei containerentsorgung.shop genau richtig. Hier haben Sie die Möglichkeit, einfach online einen Container zu bestellen. Die Planung ist mit wenigen Klicks abgeschlossen und Sie wissen sofort, mit welchen Kosten Sie inkl. fachgerechter Entsorgung zu rechnen haben. Sie wollen einen Containerdienst bestellen? Geben Sie oben Ihre Postleitzahl ein, um nähere Preis- und Serviceinformationen für Ihr Gebiet zu erhalten! Sie haben Fragen? Dann schreiben Sie uns eine Nachricht!
                </p>

                <h2 className="text-xl font-bold text-gray-900 mb-4">Hier fängt unser Service an: Diese Informationen erleichtern Ihre Planung</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Welchen Container bestellen? Was darf in den Container rein und was nicht? Hier finden Sie eine kleine Containerkunde, um die Anmietung optimal vorbereiten zu können. Sie lesen hier nicht nur, welche Container Sie mieten können. Wir verraten Ihnen auch, worauf Sie bei der Planung achten sollten und für welche Zwecke Sie einen Container mieten können.
                </p>

                <div id="why-order" className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Ihre Vorteile: Warum auf containerentsorgung.shop einen Containerdienst bestellen?</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Ihr Projekt steht an, Sie brauchen Lösungen und wollen zeitnah loslegen? Der größte Vorteil ist, dass Sie hier direkt Nägel mit Köpfen machen können! Sie brauchen nicht lange suchen oder rumtelefonieren, um einen passenden Abfallcontainer bestellen zu können. Auf unserer Plattform ist alles mit wenigen Angaben schnell erledigt. Sie müssen nur Ihre Postleitzahl eingeben, um die Preis- und Leistungsinformationen für Ihren Standort zu konkretisieren. Alles Weitere erklärt sich von selbst, wenn Sie Ihren Container mieten. Die folgenden Vorteile haben bereits viele Bauherren überzeugt:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Volle Kostenkontrolle: Wir arbeiten mit transparenten <strong>Festpreisen</strong> (Lieferung, Abholung & Entsorgung sind in der Pauschale inklusive).</li>
                    <li>Bedarfsgerechte Lösungen: Wir haben für jedes Projekt einen passenden Container.</li>
                    <li>Mit containerentsorgung.shop setzen Sie auf zertifizierte <strong>Entsorgungsfachbetriebe</strong>.</li>
                    <li>Die Bestellung ist auf unserer Plattform schnell erledigt: Sie sehen die besten Angebote verschiedenster Containerdienste.</li>
                    <li>Professionelle Baulogistik aus einer Hand: Wir stellen auch Miettoiletten und Baustoffe bereit.</li>
                  </ul>
                </div>

                <div id="container-types" className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Welche Containerarten gibt es?</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Welchen Container soll ich für mein Projekt bestellen? Mit containerentsorgung.shop haben Sie die Option, Absetzcontainer in unterschiedlichen Größen zu bestellen, die in m³ oder cbm angegeben werden. Absetzcontainer bieten ein hohes Maß an Einsatzflexibilität, da sie an fast jedem Platz sicher abgestellt werden können. Flexibel sind Sie als Bauherr nicht nur beim Ladevolumen zwischen typischerweise 3 und 10 m³: Sie können auch einen Absetzcontainer mit Klappe bestellen, was das Beladen mit einer Schubkarre wesentlich einfacher macht. Abgesehen von offenen Absetzcontainern haben Sie auch die Chance, Modelle mit Deckel zu bestellen. Auch große Abrollcontainer für Mengen von 10, 20 oder 36 Kubikmeter kann unser lokaler Containerdienst auf Anfrage liefern.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Absetzcontainer</h4><p className="text-sm text-gray-700">Standard-Container für verschiedene Abfallarten</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Absetzcontainer mit Deckel</h4><p className="text-sm text-gray-700">Geschützte Entsorgung mit Deckel</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Absetzcontainer mit Klappe</h4><p className="text-sm text-gray-700">Einfaches Beladen mit Schubkarre</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Abrollcontainer</h4><p className="text-sm text-gray-700">Große Container für große Mengen</p></div>
                  </div>
                </div>

                <div id="checklists" className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Checklisten: Wofür kann ich die Container einsetzen?</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Geben Sie einfach Ihre Postleitzahl ein und klicken Sie auf die gewünschte Abfallart. Sie können dann durch einen Klick auf den grünen Button &ldquo;Was darf rein bei …&rdquo; nachvollziehen, was in den Container rein darf und was nicht. Mit diesen detaillierten Informationen wird es Ihnen leichtfallen, den richtigen Container zu bestellen. Dank der übersichtlichen Informationen ist für Sie als Kunde kein Fachwissen erforderlich. Im Zweifelsfall beraten wir Sie gerne persönlich! Schreiben Sie uns eine Nachricht mit Ihrem Anliegen.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Tipp: So können Sie bedarfsgerecht Container mieten</h4>
                    <p className="text-blue-700 text-sm">
                      Sie können natürlich auch mehrere Container online bestellen, wenn Sie große Mengen oder auch unterschiedliche Materialien entsorgen möchten. Sie sollten dann sicherstellen, dass ausreichend Platz für die gleichzeitige Containerstellung vorhanden ist. Andernfalls können Sie hier online zeitnah einen anderen Container anfordern, wenn der erste bereits abtransportiert worden ist.
                    </p>
                  </div>
                </div>

                <div id="selection" className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Was muss ich bei der Container-Auswahl beachten?</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Sie sollten darauf achten, dass der Container vom Inhalt und Volumen her zu Ihrem Projekt passt. Der Untergrund muss tragfähig sein und die Zufahrtsstraße sollte vom LKW ohne Probleme passierbar sein. Denken Sie rechtzeitig an eine <strong>Stellgenehmigung</strong>, wenn Sie den Container im öffentlichen Raum aufstellen. Mehr dazu im nächsten Unterpunkt.
                  </p>
                </div>

                <div id="placement" className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Wo darf ein Container aufgestellt werden?</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Wenn Sie einen Container bestellen, darf dieser grundsätzlich auf Ihrem Privatgrundstück, aber auch auf öffentlichem Grund platziert werden. Muss der Container auf der Straße, dem Gehweg oder einem Parkstreifen abgestellt werden, ist dafür eine Ausnahmegenehmigung zu erwirken. Sie sollten sich daher rechtzeitig (!) um eine Genehmigung für den Container beim zuständigen Ordnungsamt kümmern. Hierzu ist ein zeitlicher Vorlauf von mindestens <strong>14 Tagen</strong> einzuplanen.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Auf Ihrem Privatgrundstück brauchen Sie keine gesonderte Genehmigung für den Mietcontainer. Je nach Straßenverlauf und Verkehrssituation kann eine zusätzliche Absicherung des Containers zur Vermeidung von Unfällen erforderlich sein.
                  </p>
                </div>

                <div id="waste-types" className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Welche Abfallarten gibt es und was darf in den Container rein?</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Hier sehen Sie einen Auszug der gängigen Abfallarten, die je nach Containerdienst unterschiedlich deklariert werden können. Es ist wichtig zu beachten, dass die Vorgaben, was in den Container darf, je nach Anbieter variieren.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Bauschutt</h4><p className="text-sm text-gray-700">Mineralische Abfälle wie Beton, Ziegel, Fliesen und Keramik.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Baumischabfall mit Mineralik</h4><p className="text-sm text-gray-700">Mischabfälle mit mineralischen Materialien, z. B. Beton, Ziegel.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Baumischabfall ohne Mineralik</h4><p className="text-sm text-gray-700">Mischabfälle ohne mineralische Materialien, z. B. Holz, Kunststoffe.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Erdaushub/Bodenaushub</h4><p className="text-sm text-gray-700">Unbelasteter Boden, Sand, Kies und Lehm.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Grünschnitt/Gartenabfälle</h4><p className="text-sm text-gray-700">Organische Materialien wie Äste, Laub, Rasen.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Altholz (Abbruchholz)</h4><p className="text-sm text-gray-700">Behandeltes oder unbehandeltes Holz aus Bau- und Abbrucharbeiten.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Gips/Gipskartonplatten</h4><p className="text-sm text-gray-700">Materialien auf Gipsbasis, z. B. von Renovierungsarbeiten.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Sperrmüll</h4><p className="text-sm text-gray-700">Große, sperrige Abfälle wie Möbel, Teppiche und Matratzen.</p></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">Geben Sie oben einfach Ihre Postleitzahl ein und klicken Sie auf die gewünschte Abfallart. Sie können dann durch einen Klick auf den grünen Button &ldquo;Was darf rein bei …&rdquo; nachvollziehen, was in den Container darf und was nicht. Mit diesen detaillierten Informationen wird es Ihnen leichtfallen, den richtigen Container zu bestellen.</p>
                </div>

                <div id="disposal" className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Entsorgung für Ihr Projekt: Containerdienst bestellen als Lösung</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">Wo gearbeitet, gebaut oder erneuert wird, fallen Materialien an. Daher können Sie auf containerentsorgung.shop unterschiedlichste Container mieten, um eine bedarfsgerechte Lösung herbeizuführen. Konkretisieren Sie Ihren Verwendungszweck, um passende Container bestellen zu können. Das Ladevolumen sollte bestmöglich auf Ihr Projekt abgestimmt werden.</p>
                  <p className="text-gray-700 mb-4 leading-relaxed">Bei den folgenden &lsquo;Projektklassikern&rsquo; bietet es sich an, einen Container als bequeme Entsorgungslösung zu mieten:</p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li><strong>Container mieten für Hausbau:</strong> Sie packen selbst mit an und organisieren den Erdaushub? Mit einem bedarfsgerechten Container von containerentsorgung.shop können die Arbeiten schnell voranschreiten.</li>
                    <li><strong>Container mieten für Badrenovierung/Küchenrenovierung:</strong> Mit einem Container vor der Tür entsteht eine zuverlässige Entsorgungslösung, um Platz für Neues zu schaffen.</li>
                    <li><strong>Container mieten für Abbrucharbeiten:</strong> Sie wollen Platz für Neues schaffen? Mit einem Mietcontainer werden &lsquo;Altlasten&rsquo; schnell aus dem Weg geräumt bzw. fachgerecht entsorgt.</li>
                    <li><strong>Container bestellen für Entrümpelungen (Sperrmüll):</strong> Mit einer professionellen Transportlösung ist eine Haushaltsauflösung schnell erledigt.</li>
                    <li><strong>Container bestellen für Gartenarbeiten:</strong> Sie haben einen grünen Daumen und wollen ohne unzählige Fahrten zur Müllkippe alles in Form bringen? Ein Mietcontainer ist die bequemste Lösung.</li>
                  </ul>
                </div>

                <div id="pickup" className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Container ist voll, und was ist mit der Abholung?</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">Auch der letzte Schritt ist denkbar einfach und bei containerentsorgung.shop bereits im Preis inbegriffen. Haben Sie den Container befüllt, stellen Sie online in wenigen Minuten einen Abholauftrag.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Sicherheit</h4><p className="text-sm text-gray-700">Selbstverständlich sind Ihre Daten geschützt – beispielsweise durch sichere Serververbindungen mit entsprechender Verschlüsselung. Unser Angebot wird in einem deutschen Rechenzentrum gehostet, welches nach den Standards des TÜV Rheinland zertifiziert ist.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Zahlungsarten</h4><p className="text-sm text-gray-700">containerentsorgung.shop bietet Ihnen bequeme Zahlung per PayPal sowie Kreditkarte. Nutzen Sie zudem praktische PayPal-Services wie &ldquo;Später zahlen&rdquo; oder die komfortable Ratenzahlung – für maximale finanzielle Flexibilität.</p></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">Kundenbewertungen</h4><p className="text-sm text-gray-700">Trusted Shops Bewertungen sind freiwillig und verifiziert, basierend auf einem durchgeführten Kaufvorgang. Alle Bewertungen ansehen.</p></div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-yellow-800 mb-3">Ihr Projekt will fertig werden: Jetzt Container online bestellen!</h4>
                    <p className="text-yellow-700">Sie haben sich hier umfassend informiert, welchen Container Sie bestellen können. Beachten Sie, dass der Preis im Wesentlichen von der Größe und vom zu entsorgenden Material abhängt. In jedem Fall werden Sie mit unseren transparenten Festpreisen sicher mit Ihrem Budget kalkulieren können.</p>
                    <p className="text-yellow-700 mt-2">Geben Sie oben Ihre Postleitzahl ein, um in wenigen Schritten einen benötigten Container mieten zu können. Wählen Sie Ihren Container und nehmen Sie online sicher die Zahlung vor. Um alles Weitere kümmert sich das engagierte Team von containerentsorgung.shop.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}


