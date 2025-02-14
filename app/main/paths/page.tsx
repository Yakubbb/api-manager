"use client"
import { BaseEntityEvent, BaseEvent, CanvasWidget, DiagramListener, LinkModelListener } from "@projectstorm/react-diagrams";

import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel
} from '@projectstorm/react-diagrams';

//        <ModelOptionsBar/>
export default function Home() {

  const engine = createEngine();
  const node1 = new DefaultNodeModel({
    id: '1',
    name: 'Node 1',
    color: 'rgb(103, 103, 103)',

  });
  node1.setPosition(100, 100);
  let port1 = node1.addOutPort('Out');

  const node2 = new DefaultNodeModel({
    id: '2',
    name: 'Node 2',
    color: 'rgb(243, 0, 0)',
  });
  node2.setPosition(100, 200);

  let port2 = node2.addOutPort('Out');
  let port3 = node2.addInPort('in');




  const model = new DiagramModel();

  model.registerListener({
    linksUpdated: (event) => {
      event.link.registerListener({
        targetPortChanged: (event) => {
          console.log(event.port?.getParent().getOptions().name);
        }
      } as LinkModelListener)
    }
  } as DiagramListener)

  model.addAll(node1, node2);
  engine.setModel(model);
  return (
    <div className="flex flex-col w-[100%] h-[95%] gap-5 m-2 p-4 overflow-hidden">
      <CanvasWidget className=" flex w-[100%] h-[60%] touch-pinch-zoom rounded-xl bg-[#cccccc]" engine={engine} />
      <div className="flex flex-row w-[100%] h-[40%]">
        <div>
          Описание
        </div>
        <div>
          Описание
        </div>
        <div>
          Описание
        </div>
        <div>
          Описание
        </div>
      </div>
    </div>
  );
}
