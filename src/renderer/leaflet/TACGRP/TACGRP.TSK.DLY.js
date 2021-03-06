import L from 'leaflet'
import * as R from 'ramda'
import { shape } from '../features/react-shape'
import '../features/OrbitArea'
import { line, arc } from '../features/geo-helper'

const OrbitArea = L.TACGRP.OrbitArea.extend({

  _shape (group, options) {
    return shape(group, options, {
      points: ({ A, B, A1, width }) => {
        const centerLine = line([A, B])
        const center = line([A, A1]).point(0.5)
        const angle = centerLine.angle() / 180 * Math.PI - Math.PI / 2

        const steps = 32
        const delta = Math.PI / steps
        const xs = R.range(0, steps + 1).map(x => angle + x * delta)

        const arrow = (tip, line) => [
          line.translate(0.1 * width).point(0.85),
          tip,
          line.translate(-0.1 * width).point(0.85)
        ]

        return [
          [...arc(center, width / 2)(xs)],
          [A, B],
          arrow(B, centerLine)
        ]
      }
    })
  }
})

const labeledOrbit = labelText => (feature, options) => {
  options.labels = () => [{
    placement: ({ A, B }) => line([A, B]).point(0.5),
    lines: [labelText],
    'font-size': 18,
    angle: ({ A, B }) => line([A, B]).angle()
  }]

  return new OrbitArea(feature, options)
}

L.Feature['G*T*L-----'] = labeledOrbit('D')
L.Feature['G*T*W-----'] = labeledOrbit('W')
L.Feature['G*T*WP----'] = labeledOrbit('WP')
L.Feature['G*T*M-----'] = labeledOrbit('R')
